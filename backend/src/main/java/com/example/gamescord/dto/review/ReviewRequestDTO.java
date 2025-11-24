package com.example.gamescord.dto.review;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {

    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1~5점입니다")
    @Max(value = 5, message = "평점은 1~5점입니다")
    private Integer score;

    @Size(max = 255, message = "리뷰는 255자 이하여야 합니다")
    private String review;
}