package com.example.gamescord.controller;

import com.example.gamescord.dto.user.*;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.user.UserService;
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

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    // 생성자 주입
    public UserController(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    // 사용자 회원가입
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signUp(@Valid @RequestBody UserSignupRequestDTO requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.signup(requestDto));
    }

    // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Boolean>> checkLoginIdDuplicate(@RequestParam String loginId) {
        boolean isDuplicate = userService.checkLoginIdDuplicate(loginId);
        return ResponseEntity.ok(Map.of("isDuplicate", isDuplicate));
    }

    // 사용자 로그인, 성공 시 JWT 토큰 반환
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDTO> login(@Valid @RequestBody UserLoginRequestDTO requestDto) {
        UserLoginResponseDTO responseDto = userService.login(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 현재 로그인된 사용자 정보(내 정보) 조회
    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserResponseDTO> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    // 현재 로그인된 사용자 정보(내 정보) 수정
    @PatchMapping(
        value="/me",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserResponseDTO> updateUserProfile(
        @AuthenticationPrincipal CustomUserDetails userDetails,

        // [2] DTO 데이터는 @RequestPart로 JSON 문자열로 받습니다.
        // 클라이언트는 이 부분을 'data'라는 이름으로 JSON 문자열을 보냅니다.
        @RequestPart("data") String requestJson,

        // [3] 파일 데이터는 @RequestPart로 MultipartFile 객체로 받습니다.
        @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            // [4] JSON 문자열을 실제 DTO 객체로 변환 (역직렬화)
            // @Valid는 ObjectMapper.readValue 호출 후에도 작동하지만,
            // Controller에서 DTO 유효성 검사를 직접 수행해야 합니다. (여기서는 간단히 생략)
            UserProfileUpdateRequestDTO requestDto =
                objectMapper.readValue(requestJson, UserProfileUpdateRequestDTO.class);

            // [5] Service 호출 시 DTO와 파일을 함께 전달
            UserResponseDTO response =
                userService.updateUserProfile(requestDto, imageFile); // MultipartFile을 전달하도록 Service 메서드 시그니처가 변경됨

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            // S3 업로드 중 발생하는 IOException 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
            // 실제 서비스에서는 ErrorResponseDTO와 같은 응답 객체를 사용해야 합니다.
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(null); // 적절한 응답 처리 필요
        }
    }

    
}
