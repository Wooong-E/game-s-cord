package com.example.gamescord.controller;

import com.example.gamescord.dto.user.*;
import com.example.gamescord.service.user.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    @PatchMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserResponseDTO> updateUserProfile(@Valid @RequestBody UserProfileUpdateRequestDTO requestDto) {
        return ResponseEntity.ok(userService.updateUserProfile(requestDto));
    }

    
}
