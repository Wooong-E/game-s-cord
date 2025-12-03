package com.example.gamescord.dto.coin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CoinBalanceResponseDTO {
    private Long userId;
    private Long balance;
}
