package com.example.gamescord.controller;


import com.example.gamescord.dto.coin.*;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.coin.CoinService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coins")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class CoinController {

    private final CoinService coinService;

    @PostMapping("/prepare-charge")
    public ResponseEntity<PrepareChargeResponseDTO> prepareCharge(
            @Valid @RequestBody PrepareChargeRequestDTO requestDto) {
        PrepareChargeResponseDTO response = coinService.prepareCharge(requestDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/charge")
    public ResponseEntity<CoinResponseDTO> chargeCoin(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CoinChargeRequestDTO requestDto) {

        CoinResponseDTO response = coinService.chargeCoin(userDetails.getUsername(), requestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<CoinHistoryResponseDTO>> getCoinHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<CoinHistoryResponseDTO> history = coinService.getCoinHistory(userDetails.getUsername());
        return ResponseEntity.ok(history);
    }

    @PostMapping("/refund")
    public ResponseEntity<CoinResponseDTO> refundCoin(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CoinRefundRequestDTO requestDto) {

        CoinResponseDTO response = coinService.refundCoin(userDetails.getUsername(), requestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/balance")
    public ResponseEntity<CoinBalanceResponseDTO> getBalance(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        CoinBalanceResponseDTO response = coinService.getBalance(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
