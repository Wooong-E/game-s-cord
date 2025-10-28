package com.example.gamescord.dto.coin;

import com.example.gamescord.domain.Coin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * 코인 단건 응답 DTO
 *
 * 왜 이렇게 만들었나?
 * - 친구 코드의 CoinHistoryResponseDTO를 기반으로 개선
 * - fromEntity 패턴 유지 (Entity → DTO 변환)
 * - 충전/사용/환불 결과를 모두 반환
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinResponseDTO {
    private Long coinId;
    private Long userId;
    private Integer coinAmount;
    private Integer paymentAmount;
    private String paymentMethod;
    private Instant createdAt;
    private String transactionType;
    private String refundReason;
    private String eventType;
    private Long currentBalance;
    private Boolean success;
    private String message;

    public static CoinResponseDTO fromEntity(Coin coin) {
        return CoinResponseDTO.builder()
                .coinId(coin.getId())
                .userId(coin.getUsers().getId())
                .coinAmount(coin.getCoinAmount())
                .paymentAmount(coin.getPaymentAmount())
                .paymentMethod(coin.getPaymentMethod())
                .createdAt(coin.getCreatedAt())
                .transactionType(coin.getTransactionType())
                .refundReason(coin.getRefundReason())
                .eventType(coin.getEventType())
                .build();
    }

    public static CoinResponseDTO success(String message, Coin coin, Long currentBalance) {
        CoinResponseDTO dto = fromEntity(coin);
        dto.success = true;
        dto.message = message;
        dto.currentBalance = currentBalance;
        return dto;
    }
}