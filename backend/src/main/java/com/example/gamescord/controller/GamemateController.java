package com.example.gamescord.controller;

import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.gamemate.GamemateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gamemates")
public class GamemateController {

    private final GamemateService gamemateService;
    private final ObjectMapper objectMapper; // ObjectMapper 주입

    // 생성자 주입
    public GamemateController(GamemateService gamemateService, ObjectMapper objectMapper) {
        this.gamemateService = gamemateService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(
        // [1] 요청 타입 변경: JSON만 받는 대신 multipart/form-data를 허용하도록 변경
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<GamemateResponseDTO>> registerGamemate(
        @AuthenticationPrincipal CustomUserDetails userDetails,

        // [2] DTO 데이터는 @RequestPart로 JSON 문자열로 받습니다.
        // 클라이언트는 이 부분을 'data'라는 이름으로 JSON 문자열을 보냅니다.
        @Valid @RequestPart("data") String requestJson,

        // [3] 파일 데이터는 @RequestPart로 MultipartFile 객체로 받습니다.
        @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            // [4] JSON 문자열을 실제 DTO 객체로 변환 (역직렬화)
            GamemateRegistrationRequestDTO requestDto =
                objectMapper.readValue(requestJson, GamemateRegistrationRequestDTO.class);

            // [5] Service 호출 시 DTO와 파일을 함께 전달
            List<GamemateResponseDTO> responseDtos =
                gamemateService.registerGamemate(userDetails.getId(), requestDto, imageFile);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDtos);

        } catch (IOException e) {
            // S3 업로드 중 발생하는 IOException 처리
            // 파일 입출력 오류는 보통 500 INTERNAL_SERVER_ERROR로 처리합니다.
            // 필요시 로깅을 추가합니다.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
            // 또는 .body(new ErrorResponseDTO("파일 업로드 처리 오류")); 와 같이 적절한 응답 DTO 사용
        }
    }

    @PatchMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<GamemateResponseDTO>> updateGamemate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody GamemateRegistrationRequestDTO requestDto) {

        List<GamemateResponseDTO> responseDtos =
                gamemateService.updateGamemate(userDetails.getId(), requestDto);

        return ResponseEntity.ok(responseDtos);
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
