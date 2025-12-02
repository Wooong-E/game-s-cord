package com.example.gamescord.service.user;

import com.example.gamescord.domain.File;
import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.user.*;
import com.example.gamescord.repository.file.FileRepository;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.security.JwtUtil;
import com.example.gamescord.service.email.EmailService;
import com.example.gamescord.service.email.VerificationCodeService;
import com.example.gamescord.service.refreshtoken.RefreshTokenService;
import com.example.gamescord.service.s3.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final S3Service s3Service;
    private final FileRepository fileRepository;
    private final VerificationCodeService verificationCodeService;
    private final EmailService emailService;

    @Value("${app.base-url}")
    private String baseUrl;

    // 회원가입 처리
    @Transactional
    public UserResponseDTO signup(UserSignupRequestDTO requestDto) {
        // 1. 인증 코드 검증
        boolean isVerified = verificationCodeService.verifyCode(requestDto.getEmail(), requestDto.getVerificationCode());
        if (!isVerified) {
            throw new IllegalArgumentException("유효하지 않거나 만료된 인증 코드입니다.");
        }

        // 2. 사용자 중복 확인
        if (userRepository.findByLoginId(requestDto.getLoginId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }
        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }

        // 3. 사용자 생성 및 저장
        String encodedPassword = passwordEncoder.encode(requestDto.getLoginPwd());

        User newUser = new User();
        newUser.setLoginId(requestDto.getLoginId());
        newUser.setLoginPwd(encodedPassword);
        newUser.setEmail(requestDto.getEmail());
        newUser.setUsersName(requestDto.getUsersName());
        newUser.setUsersBirthday(requestDto.getUsersBirthday());
        newUser.setUsersDescription(requestDto.getUsersDescription());
        newUser.setGender("None");
        newUser.setPoint(0L);
        newUser.setLoginFailCount(0);
        newUser.setEnabled(true); // 이메일 인증이 완료되었으므로 바로 활성화

        User savedUser = userRepository.saveUser(newUser);

        return toUserResponseDTO(savedUser);
    }

    // 로그인 처리 후 액세스 토큰과 리프레시 토큰 발급
    @Transactional
    public UserLoginResponseDTO login(UserLoginRequestDTO requestDto) {
        User user = userRepository.findByLoginId(requestDto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("등록된 사용자가 없습니다."));

        // 계정 활성화 상태 확인
        if (!user.isEnabled()) {
            throw new IllegalStateException("계정이 활성화되지 않았습니다. 이메일을 확인하여 계정을 활성화해주세요.");
        }

        // 계정 잠금 상태 확인
        if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("잦은 로그인 실패로 계정이 잠겼습니다. 잠금 해제 시간: " + user.getLockoutUntil());
        }

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(requestDto.getLoginId(), requestDto.getLoginPwd());

        try {
            authenticationManager.authenticate(authToken);
        } catch (BadCredentialsException e) {
            // 로그인 실패 처리
            user.setLoginFailCount(user.getLoginFailCount() + 1);
            String message = "비밀번호가 일치하지 않습니다.";
            if (user.getLoginFailCount() >= 3) {
                user.setLockoutUntil(LocalDateTime.now().plusMinutes(5));
                message += " 5분간 계정이 잠깁니다.";
            } else {
                message += " (남은 시도 횟수: " + (3 - user.getLoginFailCount()) + ")";
            }
            userRepository.saveUser(user); // 변경된 상태 저장
            throw new IllegalArgumentException(message);
        }

        // 로그인 성공 처리
        user.setLoginFailCount(0);
        user.setLockoutUntil(null);
        userRepository.saveUser(user);

        String accessToken = jwtUtil.generateAccessToken(user.getLoginId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getLoginId());

        return UserLoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    // 현재 로그인된 사용자의 프로필 수정
    @Transactional
    public UserResponseDTO updateUserProfile(UserProfileUpdateRequestDTO requestDto,
                                             MultipartFile profileImageFile) throws IOException {
        User user = getCurrentUser();

        File existingProfileFile = user.getFiles().isEmpty() ? null : user.getFiles().get(0);


        if (profileImageFile != null && !profileImageFile.isEmpty()) {

            // 3-1. 기존 파일이 있다면 S3에서 삭제하고 DB에서도 삭제
            if (existingProfileFile != null) {
                s3Service.deleteFile(existingProfileFile.getFilesUrl()); // S3에서 삭제 (filesUrl 필드 사용)
                fileRepository.delete(existingProfileFile); // DB에서 File 엔티티 삭제
                user.getFiles().remove(0); // User 엔티티의 리스트에서도 제거
            }

            // 3-2. 새로운 이미지 S3에 업로드 및 URL 획득
            String newS3Url = s3Service.uploadFile(profileImageFile);

            // 3-3. 새로운 File 엔티티 생성 및 저장
            File newFile = new File();
            newFile.setFilesUrl(newS3Url); // filesUrl 필드에 저장
            newFile.setUsers(user); // User 엔티티와 관계 연결

            fileRepository.save(newFile);

            // User 엔티티의 List<File> files에 newFile을 추가
            user.getFiles().add(newFile);
            // User 엔티티의 profileImageUrl도 업데이트
            user.setProfileImageUrl(newS3Url);
            // *주의: UserResponseDTO에 URL을 반환하기 위해 File 엔티티의 URL을 사용합니다.*
        } else if (requestDto.getProfileImageUrl() != null && requestDto.getProfileImageUrl().equals("DELETE")) {
            // [선택 사항] 이미지 삭제 요청이 들어온 경우
            if (existingProfileFile != null) {
                s3Service.deleteFile(existingProfileFile.getFilesUrl());
                fileRepository.delete(existingProfileFile);
                user.getFiles().remove(0);
                // User 엔티티의 profileImageUrl도 null로 설정
                user.setProfileImageUrl(null);
            }
        }

        if (requestDto.getUsersName() != null) user.setUsersName(requestDto.getUsersName());
        if (requestDto.getUsersDescription() != null) user.setUsersDescription(requestDto.getUsersDescription());
        if (requestDto.getUsersBirthday() != null) user.setUsersBirthday(requestDto.getUsersBirthday());
        if (requestDto.getGender() != null) user.setGender(requestDto.getGender());
        if (requestDto.getProfileImageUrl() != null) user.setProfileImageUrl(requestDto.getProfileImageUrl());

        User updatedUser = userRepository.updateUser(user);
        return toUserResponseDTO(updatedUser);
    }

    // 현재 로그인된 사용자의 프로필 조회
    @Transactional(readOnly = true)
    public UserResponseDTO getMyProfile() {
        User user = getCurrentUser();
        return toUserResponseDTO(user);
    }


    // 비밀번호 재설정 요청
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 이메일입니다."));

        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // 1시간 유효

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiryDate);
        userRepository.updateUser(user);

        // TODO: 프론트엔드 URL로 변경 필요 (예: "https://your-frontend.com/reset-password?token=" + resetToken)
        String resetLink = baseUrl + "/api/auth/reset-password-confirm?token=" + resetToken;
        emailService.sendEmail(
            email,
            "게임스코드 비밀번호 재설정",
            "비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetLink + "\n이 링크는 1시간 동안 유효합니다."
        );
    }

    // 비밀번호 재설정 처리
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않거나 만료된 비밀번호 재설정 토큰입니다."));

        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            // 토큰이 만료되었거나 유효하지 않으면 토큰 초기화
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.updateUser(user);
            throw new IllegalArgumentException("비밀번호 재설정 토큰이 만료되었거나 유효하지 않습니다.");
        }

        user.setLoginPwd(passwordEncoder.encode(newPassword));
        user.setResetToken(null); // 사용된 토큰은 제거
        user.setResetTokenExpiry(null); // 만료 시간 제거
        userRepository.updateUser(user);
    }

    // SecurityContext에서 현재 사용자 정보 가져오기
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("인증된 사용자가 없습니다.");
        }
        String loginId = authentication.getName();
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("인증된 사용자를 찾을 수 없습니다."));
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .point(user.getPoint())
                .usersName(user.getUsersName())
                .usersDescription(user.getUsersDescription())
                .usersBirthday(user.getUsersBirthday())
                .gender(user.getGender())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
