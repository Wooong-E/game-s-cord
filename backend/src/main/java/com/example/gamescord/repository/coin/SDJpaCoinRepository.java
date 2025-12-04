package com.example.gamescord.repository.coin;

import com.example.gamescord.domain.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaCoinRepository extends JpaRepository<Coin, Long> {
}