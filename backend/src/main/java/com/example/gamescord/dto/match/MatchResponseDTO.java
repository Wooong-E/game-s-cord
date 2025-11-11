package com.example.gamescord.dto.match;

import com.example.gamescord.domain.Match;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MatchResponseDTO {

    private Long ordersId;
    private Long usersId;
    private Long orderedUsersId;
    private Long orderUsersId;
    private Long ordersGameId;
    private String orderStatus;

    public static MatchResponseDTO of(Match match) {
        return MatchResponseDTO.builder()
                .ordersId(match.getId())
                .usersId(match.getUsers().getId())
                .orderedUsersId(match.getOrderedUsersId())
                .orderUsersId(match.getOrderUsersId())
                .ordersGameId(match.getOrdersGameId())
                .orderStatus(match.getOrderStatus())
                .build();
    }
}