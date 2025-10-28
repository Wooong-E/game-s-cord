package com.example.mvctest.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarkResponseDTO {
    // 기본 작업할때
    private Long markId;
    private Boolean isMarked;
    private String message;

    // 목록 조회할때
    private List<MarkedGamemate> markedGamemates;
    private Integer totalCount;

    // 즐겨찾기한 게임메이트 정보
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MarkedGamemate {
        private Long markId;
        private Long userId;
        private String usersName;
        private String usersDescription;
        private String profileImageUrl;
        private Double averageRating;
        private Integer reviewCount;
        private List<GameInfoDTO> availableGames;
    }

}