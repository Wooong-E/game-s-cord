/*package com.example.gamescord.controller;

import com.example.gamescord.dto.review.ReviewRequestDTO;
import com.example.gamescord.dto.review.ReviewResponseDTO;
import com.example.gamescord.service.review.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/gamemates/{gamemateId}/reviews")
    public ResponseEntity<ReviewResponseDTO> createReview(
            @PathVariable Long gamemateId,
            @Valid @RequestBody ReviewRequestDTO requestDto) {

        ReviewResponseDTO responseDto = reviewService.createReview(gamemateId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
*/