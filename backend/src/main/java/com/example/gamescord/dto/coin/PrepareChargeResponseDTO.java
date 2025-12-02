package com.example.gamescord.dto.coin;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PrepareChargeResponseDTO {
    private final Integer coinAmount;
    private final Integer paymentAmount;
    private final List<String> paymentMethods;
}
