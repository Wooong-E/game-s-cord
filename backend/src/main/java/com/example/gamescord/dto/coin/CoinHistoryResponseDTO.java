package com.example.gamescord.dto.coin;

import com.example.gamescord.domain.Coin;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.ZoneId;

@Getter
@Builder
public class CoinHistoryResponseDTO {
    private final Long coinId;
    private final Integer coinAmount;
    private final String transactionType; // 동적으로 "CHARGE" 또는 "USE"가 할당됨.
    private final Instant createdAt;

    public static CoinHistoryResponseDTO fromEntity(Coin coin) {
        String type = coin.getCoinAmount() > 0 ? "CHARGE" : "USE";
        return CoinHistoryResponseDTO.builder()
                .coinId(coin.getId())
                .coinAmount(coin.getCoinAmount())
                .transactionType(type)
                .createdAt(coin.getCreatedAt().atZone(ZoneId.of("Asia/Seoul"))
                        .toInstant())
                .build();
    }
}