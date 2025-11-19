package com.example.gamescord.service.notification;

import com.example.gamescord.domain.Notification;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.notification.NotificationResponseDTO;
import com.example.gamescord.dto.notification.UnreadCountResponseDTO;
import com.example.gamescord.repository.notification.NotificationRepository;
import com.example.gamescord.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    // 알람 생성
    @Transactional
    public void createNotification(Long userId, String notificationType, Long matchId, String message) {
        User user = userRepository.findById(userId);

        Notification notification = new Notification();
        notification.setUsers(user);
        notification.setNotificationType(notificationType);
        notification.setMatchId(matchId);
        notification.setMessage(message);
        notification.setIsRead(false);

        notificationRepository.saveNotification(notification);
    }


    // 모든 알람 조회
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);
        return notifications.stream()
                .map(NotificationResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }


    // 읽지 않은 알람 개수 조회
    @Transactional(readOnly = true)
    public UnreadCountResponseDTO getUnreadCount(Long userId) {
        Long count = notificationRepository.countUnreadByUserId(userId);
        return UnreadCountResponseDTO.builder()
                .unreadCount(count != null ? count : 0L)
                .build();
    }
    // 모든 알람 읽음 처리
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);
        for (Notification notification : notifications) {
            if (!notification.getIsRead()) {
                notification.setIsRead(true);
                notificationRepository.saveNotification(notification);
            }
        }
    }

    //알람 삭제
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알람을 찾을 수 없습니다."));

        if (!notification.getUsers().getId().equals(userId)) {
            throw new IllegalArgumentException("본인의 알람만 삭제할 수 있습니다.");
        }

        notificationRepository.deleteNotification(notification);
    }
}