package com.example.mvctest.repository.match;

import com.example.mvctest.domain.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaMatchRepository extends JpaRepository<Match, Long> {

}