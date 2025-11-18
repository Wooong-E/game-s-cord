package com.example.gamescord.dto.gamemate;

import com.example.gamescord.domain.Gamemate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GamemateResponseDTO {

    private Long gamemateId;
    private Long userId;
    private String userName;
    private Long gameId;
    private String gameName;
    private Long price;
    private String tier;

    public static GamemateResponseDTO fromEntity(Gamemate gamemate) {
        return GamemateResponseDTO.builder()
                .gamemateId(gamemate.getId())
                .userId(gamemate.getUsers().getId())
                .userName(gamemate.getUsers().getUsersName())
                .gameId(gamemate.getGames().getId())
                .gameName(gamemate.getGames().getGamesName())
                .price(gamemate.getPrice())
                .tier(gamemate.getTier())
                .build();
    }

}
