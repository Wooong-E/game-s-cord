package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoinChargeRequestDTO {
    @NotNull(message = "패키지 ID는 필수입니다.")
    private Integer packageId;

    @NotBlank(message = "결제 수단은 필수입니다.")
    private String paymentMethod;
}
