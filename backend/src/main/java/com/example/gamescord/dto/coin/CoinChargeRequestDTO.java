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
public class CoinChargeRequestDTO {

    @NotNull(message = "결제 금액은 필수입니다")
    private Integer paymentAmount;

    @NotNull(message = "결제 방법은 필수입니다")
    @Size(max = 45, message = "결제 방법은 45자 이하여야 합니다")
    private String paymentMethod;

    private Integer coinAmount;

    private Integer packageId;
}