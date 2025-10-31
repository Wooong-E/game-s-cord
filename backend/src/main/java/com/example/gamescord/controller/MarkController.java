package com.example.gamescord.controller;

import com.example.gamescord.dto.mark.MarkedUserResponseDTO;
import com.example.gamescord.dto.mark.MarkResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.mark.MarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarkController {

    private final MarkService markService;

    @PostMapping("/{markedUserId}")
    public ResponseEntity<MarkResponseDTO> addMark(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long markedUserId) {

        MarkResponseDTO responseDto = markService.addMark(userDetails.getId(), markedUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<MarkedUserResponseDTO>> getMarkedUsers(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MarkedUserResponseDTO> markedUsers = markService.getMarkedUsers(userDetails.getId());
        return ResponseEntity.ok(markedUsers);
    }

    @DeleteMapping("/{markedUserId}")
    public ResponseEntity<Void> deleteMark(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long markedUserId) {
        markService.deleteMark(userDetails.getId(), markedUserId);
        return ResponseEntity.noContent().build();
    }
}
