package com.example.gamescord.service.refreshtoken;

import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.domain.User;
import com.example.gamescord.repository.refreshtoken.RefreshTokenRepository;
import com.example.gamescord.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh.expiration.ms}")
    private Long refreshTokenDurationMs;

    // 토큰 문자열로 리프레시 토큰을 조회
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // 사용자 로그인 ID를 기반으로 리프레시 토큰을 생성하고 DB에 저장
    @Transactional
    public RefreshToken createRefreshToken(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        // 기존 토큰이 있는지 확인하고, 있으면 업데이트, 없으면 새로 생성
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    // 리프레시 토큰의 만료 여부를 검증하고, 만료 시 DB에서 삭제
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request.");
        }
        return token;
    }

    // 사용자 ID로 리프레시 토큰 삭제
    @Transactional
    public int deleteByUserId(Long userId) {
        User user = userRepository.findById(userId);
        return refreshTokenRepository.deleteByUser(user);
    }
}