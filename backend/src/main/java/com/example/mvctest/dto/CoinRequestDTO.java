package com.example.mvctest.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoinRequestDTO {

    @Min(value = 1000, message = "최소 충전 금액은 1000원입니다")
    private Integer paymentAmount;

    @Size(max = 45, message = "결제 방법은 45자 이하여야 합니다")
    private String paymentMethod;

    private Integer coinAmount;

    @Min(value = 1, message = "최소 1코인 이상 사용해야 합니다")
    private Integer useAmount;

    private Long orderId;

    private Long coinId;

    @Size(max = 500, message = "환불 사유는 500자 이하여야 합니다")
    private String refundReason;
}