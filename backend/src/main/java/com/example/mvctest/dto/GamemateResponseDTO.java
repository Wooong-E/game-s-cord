package com.example.mvctest.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamemateResponseDTO {
    private Long gamemateId;
    private Long userId;
    private String usersName;
    private String usersDescription;
    private String profileImageUrl;

    // 게임 정보
    private Long gameId;
    private String gameName;
    private Long price;
    private String tier;
    private String tierScreenshotUrl;
    private String availableTime;
    private String gender;

    // 평가 정보
    private Double averageRating;
    private Integer reviewCount;
    private Boolean isBookmarked;

    // 검색 결과 리스트
    private List<GamemateResponseDTO> gamemates;
    private Integer totalCount;
}