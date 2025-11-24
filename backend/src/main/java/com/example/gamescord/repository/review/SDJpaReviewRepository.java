package com.example.gamescord.repository.review;

import com.example.gamescord.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaReviewRepository extends JpaRepository<Review, Long> {
}