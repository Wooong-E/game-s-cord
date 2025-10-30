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