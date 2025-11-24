package com.example.gamescord.dto.match;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchRequestDTO {
    private Long orderedUsersId;
    private Long ordersGameId;
}