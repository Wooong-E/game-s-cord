package com.example.gamescord.dto.gamemate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GamemateRegistrationRequestDTO {

    @NotNull
    private List<GameInfo> games;

    @Size(max = 255, message = "소개글은 255자 이하여야 합니다.")
    private String introduction;

    @Getter
    @Setter
    public static class GameInfo {
        @NotNull(message = "게임 ID는 필수입니다.")
        private Long gameId;

        @NotNull(message = "가격은 필수입니다.")
        private Long price;
    }
}
