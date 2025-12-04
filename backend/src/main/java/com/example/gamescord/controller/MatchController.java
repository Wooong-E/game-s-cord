package com.example.gamescord.controller;

import com.example.gamescord.dto.match.MatchListResponseDTO;
import com.example.gamescord.dto.match.MatchRequestDTO;
import com.example.gamescord.dto.match.MatchResponseDTO;
import com.example.gamescord.dto.match.MatchStatusUpdateByKeyDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.match.MatchService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchResponseDTO> requestMatch(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody MatchRequestDTO requestDto) {
        MatchResponseDTO responseDto = matchService.requestMatch(userDetails.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
     // 내가 보낸 매칭 요청 목록 조회
    @GetMapping("/sent")
    public ResponseEntity<List<MatchListResponseDTO>> getSentMatches(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MatchListResponseDTO> matches = matchService.getSentMatches(userDetails.getId());
        return ResponseEntity.ok(matches);
    }

     // 내가 받은 매칭 요청 목록 조회
    @GetMapping("/received")
    public ResponseEntity<List<MatchListResponseDTO>> getReceivedMatches(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MatchListResponseDTO> matches = matchService.getReceivedMatches(userDetails.getId());
        return ResponseEntity.ok(matches);
    }

    // 매칭 수락
    @PatchMapping("/{matchId}/accept")
    public ResponseEntity<MatchResponseDTO> acceptMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchResponseDTO responseDto = matchService.acceptMatch(matchId, userDetails.getId());
        return ResponseEntity.ok(responseDto);
    }

    // 매칭 거절
    @PatchMapping("/{matchId}/decline")
    public ResponseEntity<MatchResponseDTO> declineMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchResponseDTO responseDto = matchService.declineMatch(matchId, userDetails.getId());
        return ResponseEntity.ok(responseDto);
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
