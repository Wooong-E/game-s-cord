<<<<<<< HEAD
package com.example.mvctest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long reviewId;
    private Integer score;
    private String review;
    private String createdAt;

    //리뷰 작성자 정보
    private Long userId;           // 작성자 ID
    private String userName;
}
=======
/*
package com.example.gamescord.dto.review;

import com.example.gamescord.domain.Review;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponseDTO {

    private Long reviewId;
    private Integer score;
    private String review;
    private Long gamemateId;

    public static ReviewResponseDTO fromEntity(Review review) {
        return ReviewResponseDTO.builder()
                .reviewId(review.getId())
                .score(review.getScore())
                .review(review.getReview())
                .gamemateId(review.getGamemates().getId())
                .build();
    }
}
*/
>>>>>>> origin/feature/backend/develop1
