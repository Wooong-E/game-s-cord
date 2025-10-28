package com.example.gamescord.dto.coin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinPackageDTO {

    private Integer packageId;
    private Integer coinAmount;
    private Integer paymentAmount;
    private Double pricePerCoin;
    private Integer discountRate;
    private Boolean isRecommended;
    private Integer bonusCoin;
    private String packageName;
}