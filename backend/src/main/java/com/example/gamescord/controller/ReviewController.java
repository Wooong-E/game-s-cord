package com.example.gamescord.controller;

import com.example.gamescord.dto.review.ReviewRequestDTO;
import com.example.gamescord.dto.review.ReviewResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.review.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/gamemates/{userId}/{gameId}/reviews")
    public ResponseEntity<ReviewResponseDTO> createReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long userId,
            @PathVariable Long gameId,
            @Valid @RequestBody ReviewRequestDTO requestDto) {

        ReviewResponseDTO responseDto = reviewService.createReview(userDetails.getId(), userId, gameId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/gamemates/{userId}/{gameId}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForUserAndGame(
            @PathVariable Long userId, @PathVariable Long gameId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsForUserAndGame(userId, gameId);
        return ResponseEntity.ok(reviews);
    }
}