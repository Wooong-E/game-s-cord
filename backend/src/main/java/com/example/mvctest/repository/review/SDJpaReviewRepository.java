package com.example.mvctest.repository.review;

import com.example.mvctest.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaReviewRepository extends JpaRepository<Review, Long> {
}