package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoinChargeRequestDTO {
    @NotNull(message = "결제 금액은 필수입니다")
    private Integer paymentAmount;

    private Integer coinAmount;

    private Integer packageId;
}
