package com.example.mvctest.repository.mark;

import com.example.mvctest.domain.Mark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaMarkRepository extends JpaRepository<Mark, Long> {
}