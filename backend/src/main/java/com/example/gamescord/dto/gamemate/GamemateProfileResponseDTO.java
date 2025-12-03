package com.example.gamescord.dto.gamemate;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GamemateProfileResponseDTO {
    private Long userId;
    private String userName;
    private String userDescription;
    private String profileImageUrl;
    private Double overallAverageScore; // 전체 평균 평점

    private List<GameProfile> games;

    @Getter
    @Builder
    public static class GameProfile { // GameWithPrice -> GameProfile
        private Long gameId;
        private String gameName;
        private Long price;
        private String tier;
        private String start;
        private String end;
        private Double averageScore; // 게임별 평균 평점
    }
}