package com.example.gamescord.dto.review;

import com.example.gamescord.domain.Review;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long reviewId;
    private Integer score;
    private String review;

    //리뷰 작성자 정보
    private Long userId;           // 작성자 ID
    private String userName;

    public static ReviewResponseDTO fromEntity(Review review) {
        return ReviewResponseDTO.builder()
                .reviewId(review.getId())
                .score(review.getScore())
                .review(review.getReviewDescription())
                .userId(review.getUsers().getId())
                .userName(review.getUsers().getUsersName())
                .build();
    }
}