package com.example.gamescord.dto.coin;

import com.example.gamescord.domain.Coin;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.ZoneId;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CoinResponseDTO {
    // Transaction Details
    private final Long coinId;
    private final Long userId;
    private final Integer coinAmount;
    private final String transactionType; // 해당 요청이 코인 충전인지, 코인 사용하기 인지.
    private final Instant createdAt;

    // Response Status
    private final Boolean success;
    private final String message;
    private final Long currentBalance;

    public static CoinResponseDTO fromEntity(Coin coin) {
        if (coin == null) {
            return null;
        }
        String type = coin.getCoinAmount() > 0 ? "CHARGE" : "USE";
        return CoinResponseDTO.builder()
                .coinId(coin.getId())
                .userId(coin.getUsers().getId())
                .coinAmount(coin.getCoinAmount())
                .transactionType(type)
                .createdAt(coin.getCreatedAt().atZone(ZoneId.of("Asia/Seoul"))
                        .toInstant())
                .build();
    }

    // 거래 정보가 있을 때의 성공 응답
    public static CoinResponseDTO success(String message, Coin coin, Long currentBalance) {
        CoinResponseDTO dto = fromEntity(coin);
        return new CoinResponseDTO(
                dto.getCoinId(), dto.getUserId(), dto.getCoinAmount(),
                dto.getTransactionType(), dto.getCreatedAt(),
                true, message, currentBalance
        );
    }

    // 거래 정보가 없을 때의 성공 응답 (환불 등)
    public static CoinResponseDTO success(String message, Long currentBalance) {
        return new CoinResponseDTO(
                null, null, null, null, null,
                true, message, currentBalance
        );
    }

    // 모든 필드를 받는 private 생성자
    private CoinResponseDTO(Long coinId, Long userId, Integer coinAmount, String transactionType, Instant createdAt, Boolean success, String message, Long currentBalance) {
        this.coinId = coinId;
        this.userId = userId;
        this.coinAmount = coinAmount;
        this.transactionType = transactionType;
        this.createdAt = createdAt;
        this.success = success;
        this.message = message;
        this.currentBalance = currentBalance;
    }
}