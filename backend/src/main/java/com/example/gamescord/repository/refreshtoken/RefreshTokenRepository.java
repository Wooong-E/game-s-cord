package com.example.gamescord.repository.refreshtoken;

import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // 토큰 문자열로 리프레시 토큰을 조회
    Optional<RefreshToken> findByToken(String token);

    // 사용자로 리프레시 토큰을 조회
    Optional<RefreshToken> findByUser(User user);

    // 사용자로 리프레시 토큰을 삭제
    int deleteByUser(User user);
}