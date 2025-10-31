package com.example.gamescord.controller;

import com.example.gamescord.dto.match.MatchRequestDTO;
import com.example.gamescord.dto.match.MatchResponseDTO;
import com.example.gamescord.dto.match.MatchStatusUpdateByKeyDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.match.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchResponseDTO> requestMatch(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody MatchRequestDTO requestDto) {
        MatchResponseDTO responseDto = matchService.requestMatch(userDetails.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PatchMapping("/status")
    public ResponseEntity<MatchResponseDTO> updateMatchStatus(
            @Valid @RequestBody MatchStatusUpdateByKeyDTO requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchResponseDTO responseDto = matchService.updateMatchStatus(requestDto, userDetails.getId());
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{matchId}")
    public ResponseEntity<MatchResponseDTO> cancelMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchResponseDTO responseDto = matchService.cancelMatchByUser(matchId, userDetails.getId());
        return ResponseEntity.ok(responseDto);
    }
}
