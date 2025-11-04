package com.example.gamescord.controller;

import com.example.gamescord.dto.user.UserLoginRequestDTO;
import com.example.gamescord.dto.user.UserResponseDTO;
import com.example.gamescord.dto.user.UserSignupRequestDTO;
import com.example.gamescord.dto.user.UserProfileUpdateRequestDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signUp(@Valid @RequestBody UserSignupRequestDTO requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.signup(requestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody UserLoginRequestDTO requestDto,
                                                 HttpServletRequest request) {
        return ResponseEntity.ok(userService.login(requestDto, request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("{\"message\": \"Logged out successfully\"}");
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponseDTO> updateUserProfile(@Valid @RequestBody UserProfileUpdateRequestDTO requestDto) {
        String loginId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        return ResponseEntity.ok(
                userService.updateUserProfile(loginId, requestDto)
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getUserProfile() {
        String loginId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        return ResponseEntity.ok(
                userService.getUserProfile(loginId)
        );
    }
}