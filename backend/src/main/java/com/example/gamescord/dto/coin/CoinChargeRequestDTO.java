package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.Min;
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
    @NotNull(message = "충전할 코인 양은 필수입니다")
    @Min(value = 1000, message = "최소 충전 금액은 1000코인입니다")
    private Integer coinAmount;

    @NotNull(message = "결제 금액은 필수입니다")
    @Min(value = 1000, message = "최소 결제 금액은 1000원입니다")
    private Integer paymentAmount;


    @NotNull(message = "결제 방법은 필수입니다")
    @Size(max = 45, message = "결제 방법은 45자 이하여야 합니다")
    private String paymentMethod;
}
