package com.example.gamescord.dto.coin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinHistoryListResponseDTO {

    private List<CoinHistoryResponseDTO> histories;
    private Integer totalCount;
    private Long currentBalance;
}