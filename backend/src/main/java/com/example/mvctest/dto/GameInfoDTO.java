package com.example.mvctest.dto;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameInfoDTO {
    private Long gameId;
    private String gameName;
    private Long price;
}