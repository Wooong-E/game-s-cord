package com.example.gamescord.repository.notification;

import com.example.gamescord.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaNotificationRepository extends JpaRepository<Notification, Long> {
}