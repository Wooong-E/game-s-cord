package com.example.gamescord.dto.notification;

import com.example.gamescord.domain.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long id;
    private Long userId;
    private String notificationType;
    private Long matchId;
    private String message;
    private Boolean isRead;
    private Instant createdAt;

    public static NotificationResponseDTO fromEntity(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .userId(notification.getUsers().getId())
                .notificationType(notification.getNotificationType())
                .matchId(notification.getMatchId())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}