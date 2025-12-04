package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "users_id", nullable = false)
    private User users;

    // MATCH_REQUEST, MATCH_ACCEPTED, MATCH_DECLINED
    @Size(max = 50)
    @NotNull
    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType;

    @Column(name = "match_id")
    private Long matchId;

    @Size(max = 500)
    @Column(name = "message", length = 500)
    private String message;

    @NotNull
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}