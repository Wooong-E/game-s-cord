package com.example.mvctest.repository.gamemate;

import com.example.mvctest.domain.Gamemate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaGameMateRepository extends JpaRepository<Gamemate, Long> {
}