package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoinRefundRequestDTO {
    @NotNull(message = "코인 ID는 필수입니다")
    private Long coinId;

    @NotNull(message = "환불 사유는 필수입니다")
    @Size(min = 10, max = 500, message = "환불 사유는 10자 이상 500자 이하여야 합니다")
    private String refundReason;
}