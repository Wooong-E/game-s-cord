package com.example.gamescord.repository.file;

import com.example.gamescord.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaFileRepository extends JpaRepository<File,Long> {
}
