package com.example.gamescord.service.user;

import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.user.*;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.security.JwtUtil;
import com.example.gamescord.service.refreshtoken.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    // 회원가입 처리
    @Transactional
    public UserResponseDTO signup(UserSignupRequestDTO requestDto) {
        if (userRepository.findByLoginId(requestDto.getLoginId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        String encodedPassword = passwordEncoder.encode(requestDto.getLoginPwd());

        User newUser = new User();
        newUser.setLoginId(requestDto.getLoginId());
        newUser.setLoginPwd(encodedPassword);
        newUser.setUsersName(requestDto.getUsersName());
        newUser.setUsersBirthday(requestDto.getUsersBirthday());
        newUser.setUsersDescription(requestDto.getUsersDescription());
        newUser.setGender("None");
        newUser.setPoint(0L);
        newUser.setLoginFailCount(0);

        User savedUser = userRepository.saveUser(newUser);
        return toUserResponseDTO(savedUser);
    }

    // 로그인 처리 후 액세스 토큰과 리프레시 토큰 발급
    @Transactional
    public UserLoginResponseDTO login(UserLoginRequestDTO requestDto) {
        User user = userRepository.findByLoginId(requestDto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("등록된 사용자가 없습니다."));

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
    public UserResponseDTO updateUserProfile(UserProfileUpdateRequestDTO requestDto) {
        User user = getCurrentUser();

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
