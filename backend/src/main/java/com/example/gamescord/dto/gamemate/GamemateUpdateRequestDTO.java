package com.example.gamescord.dto.gamemate;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Size;

import java.sql.Time;
import java.util.List;

@Getter
@Setter
public class GamemateUpdateRequestDTO {

    @NotNull
    private List<GameInfo> games;

    @Getter
    @Setter
    public static class GameInfo {
        @NotNull(message = "게임 ID는 필수입니다.")
        private Long gameId;

        @NotNull(message = "가격은 필수입니다.")
        @Max(value = 2000, message = "가격은 판당 2000코인을 초과할 수 없습니다.")
        private Long price;

        @jakarta.validation.constraints.NotBlank(message = "티어는 필수입니다.")
        @Size(max = 45)
        private String tier;

        @NotNull(message = "시작 시간은 필수입니다.")
        @JsonFormat(pattern = "HH:mm:ss")
        private Time start;

        @NotNull(message = "마감 시간은 필수입니다.")
        @JsonFormat(pattern = "HH:mm:ss")
        private Time end;
    }
}
