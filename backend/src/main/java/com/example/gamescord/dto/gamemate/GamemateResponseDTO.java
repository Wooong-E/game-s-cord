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
    private String profileImageUrl;
    private Long gameId;
    private String gameName;
    private Long price;
    private String tier;
    private String gender;
    private String start;
    private String end;

    public static GamemateResponseDTO fromEntity(Gamemate gamemate) {
        return GamemateResponseDTO.builder()
                .gamemateId(gamemate.getId())
                .userId(gamemate.getUsers().getId())
                .userName(gamemate.getUsers().getUsersName())
                .profileImageUrl(gamemate.getUsers().getProfileImageUrl())
                .gameId(gamemate.getGames().getId())
                .gameName(gamemate.getGames().getGamesName())
                .price(gamemate.getPrice())
                .tier(gamemate.getTier())
                .gender(gamemate.getUsers().getGender())
                .start(gamemate.getStart().toString())
                .end(gamemate.getEnd().toString())
                .build();
    }

}
