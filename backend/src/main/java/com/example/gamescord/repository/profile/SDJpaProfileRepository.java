package com.example.gamescord.repository.profile;

import com.example.gamescord.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaProfileRepository extends JpaRepository<Profile,Long> {
}
