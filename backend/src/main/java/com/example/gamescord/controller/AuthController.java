package com.example.gamescord.controller;

import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.dto.message.MessageResponseDTO;
import com.example.gamescord.dto.auth.TokenRefreshRequestDTO;
import com.example.gamescord.dto.auth.TokenRefreshResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.security.JwtUtil;
import com.example.gamescord.service.refreshtoken.RefreshTokenService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

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
