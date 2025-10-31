package com.example.gamescord.dto.match;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchStatusUpdateByKeyDTO {
    private Long orderUsersId;
    private Long orderedUsersId;
    private Long ordersGameId;
    private String orderStatus;
}

