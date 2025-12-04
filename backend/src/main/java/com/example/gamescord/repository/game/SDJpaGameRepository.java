package com.example.gamescord.repository.game;

import com.example.gamescord.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaGameRepository extends JpaRepository<Game, Long> {
}