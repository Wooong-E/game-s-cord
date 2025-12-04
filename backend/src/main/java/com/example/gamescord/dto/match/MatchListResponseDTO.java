package com.example.gamescord.dto.match;

import com.example.gamescord.domain.Match;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MatchListResponseDTO {

    private Long ordersId;
    private Long usersId;
    private Long orderedUsersId;
    private Long orderUsersId;
    private Long ordersGameId;
    private String orderStatus;
    private String orderedUsername;

}
