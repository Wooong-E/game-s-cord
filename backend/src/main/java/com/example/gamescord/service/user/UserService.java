package com.example.gamescord.service.user;

import com.example.gamescord.domain.User;
import com.example.gamescord.dto.user.UserLoginRequestDTO;
import com.example.gamescord.dto.user.UserResponseDTO;
import com.example.gamescord.dto.user.UserSignupRequestDTO;
import com.example.gamescord.dto.user.UserProfileUpdateRequestDTO;
import com.example.gamescord.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    @Transactional
    public User signup(UserSignupRequestDTO requestDto) {
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
        newUser.setPoint(0L);
        newUser.setLoginFailCount(0);

        return userRepository.save(newUser);
    }

    /**
     * 로그인 처리
     * @param requestDto 로그인 DTO
     * @param request HttpServletRequest (세션 저장용)
     * @return UserResponseDTO
     */
    @Transactional
    public UserResponseDTO login(UserLoginRequestDTO requestDto, HttpServletRequest request) {
        User user = userRepository.findByLoginId(requestDto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("등록된 사용자가 없습니다."));

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(requestDto.getLoginId(), requestDto.getLoginPwd());

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(authToken);
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(authentication);
        securityContextRepository.saveContext(context, request, null);

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

    @Transactional
    public User updateUserProfile(Long userId, UserProfileUpdateRequestDTO requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (requestDto.getUsersName() != null) user.setUsersName(requestDto.getUsersName());
        if (requestDto.getUsersDescription() != null) user.setUsersDescription(requestDto.getUsersDescription());
        if (requestDto.getUsersBirthday() != null) user.setUsersBirthday(requestDto.getUsersBirthday());
        if (requestDto.getGender() != null) user.setGender(requestDto.getGender());
        if (requestDto.getProfileImageUrl() != null) user.setProfileImageUrl(requestDto.getProfileImageUrl());

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

}
