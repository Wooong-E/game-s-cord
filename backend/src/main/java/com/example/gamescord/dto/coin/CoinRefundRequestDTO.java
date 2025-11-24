package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoinRefundRequestDTO {
    @NotNull(message = "환불할 코인 ID는 필수입니다")
    private Long coinId;
}