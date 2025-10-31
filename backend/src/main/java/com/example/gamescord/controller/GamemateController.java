package com.example.gamescord.controller;

import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
<<<<<<< HEAD
import com.example.gamescord.dto.gamemate.SingleGamemateProfileResponseDTO;
=======
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO;
>>>>>>> origin/feature/backend/develop1
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.gamemate.GamemateService;
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

    @GetMapping("/profile/{userId}")
<<<<<<< HEAD
    public ResponseEntity<SingleGamemateProfileResponseDTO> getGamemateProfile(
            @PathVariable Long userId,
            @RequestParam Long gameId) {
        SingleGamemateProfileResponseDTO profile = gamemateService.getSingleGamemateProfile(userId, gameId);
        return ResponseEntity.ok(profile);
    }
}
=======
    public ResponseEntity<GamemateProfileResponseDTO> getGamemateProfile(
            @PathVariable Long userId) {
        GamemateProfileResponseDTO profile = gamemateService.getGamemateProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
>>>>>>> origin/feature/backend/develop1
