package com.example.gamescord.controller;

import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.gamemate.GamemateService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gamemates")
@RequiredArgsConstructor
public class GamemateController {

    private final GamemateService gamemateService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<GamemateResponseDTO>> registerGamemate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody GamemateRegistrationRequestDTO requestDto) {

        List<GamemateResponseDTO> responseDtos = gamemateService.registerGamemate(userDetails.getId(), requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GamemateResponseDTO>> searchGamemates(@RequestParam String userName) {
        List<GamemateResponseDTO> results = gamemateService.searchGamematesByUserName(userName);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<GamemateResponseDTO>> filterGamemates(
            @RequestParam Long gameId,
            @RequestParam(required = false, defaultValue = "모두") String gender,
            @RequestParam(required = false, defaultValue = "모두") String tier,
            @RequestParam(required = false, defaultValue = "reviewsScore") String sortBy) {
        List<GamemateResponseDTO> results = gamemateService.searchGamematesByFilter(gameId, gender, tier, sortBy);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<GamemateProfileResponseDTO> getGamemateProfile(
            @PathVariable Long userId) {
        GamemateProfileResponseDTO profile = gamemateService.getGamemateProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/popular/{gameId}")
    public ResponseEntity<List<GamemateResponseDTO>> getPopularGamemates(@PathVariable Long gameId) {
        List<GamemateResponseDTO> results = gamemateService.getPopularGamemates(gameId);
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/{gameId}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteGamemate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long gameId) {
        gamemateService.deleteGamemate(userDetails.getId(), gameId);
        return ResponseEntity.noContent().build();
    }
}
