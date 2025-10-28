package com.example.mvctest.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinResponseDTO {
    private Long coinId;
    private Long userId;
    private Integer coinAmount;
    private Integer paymentAmount;
    private String paymentMethod;
    private LocalDateTime createdAt;

    private Long currentBalance;  // 현재 잔액

    // 작업 결과
    private Boolean success;
    private String message;

    private Integer chargedCoins;    // 충전된 코인
    private Integer usedCoins;       // 사용된 코인
    private Integer refundedCoins;   // 환불된 코인

    // 이벤트 코인 관련
    private String eventType;

    // + 내역 조회용
    private List<CoinHistory> histories;
    private Integer totalCount;

    // + 코인 내역 조회
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CoinHistory {
        private Long coinId;
        private Integer coinAmount;
        private Integer paymentAmount;
        private String paymentMethod;
        private LocalDateTime createdAt;
        private String transactionType;
    }
}