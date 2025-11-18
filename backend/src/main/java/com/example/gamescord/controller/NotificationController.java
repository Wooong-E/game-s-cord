package com.example.gamescord.controller;

import com.example.gamescord.dto.notification.NotificationResponseDTO;
import com.example.gamescord.dto.notification.UnreadCountResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 내 알람 목록 조회
     * 프론트에서 주기적으로 호출하거나 알람 버튼 클릭 시 호출
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponseDTO> notifications = notificationService.getNotifications(userDetails.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * 읽지 않은 알람 개수 조회
     * 프론트에서 주기적으로 호출해서 알람 버튼에 배지 표시
     */
    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponseDTO> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UnreadCountResponseDTO count = notificationService.getUnreadCount(userDetails.getId());
        return ResponseEntity.ok(count);
    }

    /**
     * 알람 읽음 처리
     * 사용자가 알람을 클릭했을 때 호출
     */
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        NotificationResponseDTO notification = notificationService.markAsRead(notificationId, userDetails.getId());
        return ResponseEntity.ok(notification);
    }

    /**
     * 알람 삭제
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.deleteNotification(notificationId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
