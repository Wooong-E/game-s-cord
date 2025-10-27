package com.example.mvctest.repository.game;

import com.example.mvctest.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaGameRepository extends JpaRepository<Game, Long> {
}