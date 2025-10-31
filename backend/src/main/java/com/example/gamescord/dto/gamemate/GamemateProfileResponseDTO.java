package com.example.gamescord.dto.gamemate;

import com.example.gamescord.domain.User;
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
    // private String availableTime; // 추후 추가

    private List<GameWithPrice> games;

    @Getter
    @Builder
    public static class GameWithPrice {
        private Long gameId;
        private String gameName;
        private Long price;
    }
}
