package com.example.gamescord.controller;

import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.dto.auth.*;
import com.example.gamescord.dto.message.MessageResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.security.JwtUtil;
import com.example.gamescord.service.email.EmailService;
import com.example.gamescord.service.email.VerificationCodeService;
import com.example.gamescord.service.refreshtoken.RefreshTokenService;
import com.example.gamescord.service.user.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.context.Context;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final EmailService emailService;
    private final VerificationCodeService verificationCodeService;

    // 이메일 인증 코드 요청
    @PostMapping("/request-verification")
    public ResponseEntity<?> requestVerificationCode(@Valid @RequestBody EmailVerificationRequestDTO request) {
        String email = request.getEmail();
        String code = verificationCodeService.generateAndStoreCode(email);

        String subject = "Game's cord 에 가입하신 것을 환영합니다!";

        Context context = new Context();
        context.setVariable("code", code);

        emailService.sendEmail(email, subject, "email/verification", context);

        return ResponseEntity.ok(new MessageResponseDTO("인증 코드가 이메일로 발송되었습니다."));
    }

    // 비밀번호 재설정 요청
    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDTO request) {
        userService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(new MessageResponseDTO("비밀번호 재설정 인증코드가 이메일로 발송되었습니다."));
    }

    // 비밀번호 재설정 처리
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetDTO request) {
        userService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponseDTO("비밀번호가 성공적으로 재설정되었습니다."));
    }

    // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequestDTO request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtil.generateAccessToken(user.getLoginId());
                    return ResponseEntity.ok(new TokenRefreshResponseDTO(newAccessToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    // 로그아웃 (DB에서 리프레시 토큰 삭제)
    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> logoutUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        refreshTokenService.deleteByUserId(userId);
        return ResponseEntity.ok(new MessageResponseDTO("Log out successful!"));
    }
}
