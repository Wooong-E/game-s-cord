package com.example.mvctest.dto;

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
    @NotNull(message = "게임메이트 ID는 필수입니다")
    private Long gamematesId;

    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1~5점입니다")
    @Max(value = 5, message = "평점은 1~5점입니다")
    private Integer score;

    @Size(max = 255, message = "리뷰는 255자 이하여야 합니다")
    private String review;
}