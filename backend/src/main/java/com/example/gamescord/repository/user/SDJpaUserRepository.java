package com.example.gamescord.repository.user;

import com.example.gamescord.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaUserRepository extends JpaRepository<User, Long> {
}