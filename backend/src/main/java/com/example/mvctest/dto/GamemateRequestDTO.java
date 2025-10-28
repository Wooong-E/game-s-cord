package com.example.mvctest.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GamemateRequestDTO {

    private Long gameId;

    @Min(value = 1000, message = "최소 요금은 1000원입니다")
    @Max(value = 100000, message = "최대 요금은 100000원입니다")
    private Long price;

    @Size(max = 50, message = "티어 정보는 50자 이하여야 합니다")
    private String tier;

    private String tierScreenshotUrl;

    @Size(max = 100, message = "이용가능 시간대는 100자 이하여야 합니다")
    private String availableTime;

    @Size(max = 10, message = "성별 정보는 10자 이하여야 합니다")
    private String gender;

    // 검색 최소/최대 가격
    private Long minPrice;
    private Long maxPrice;

    // 검색 정렬 기준
    private String sortBy;
}