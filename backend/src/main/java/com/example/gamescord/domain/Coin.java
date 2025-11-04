package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "coin")
public class Coin {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "coin_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "users_id", nullable = false)
  private User users;

  @NotNull
  @Column(name = "coin_amount", nullable = false)
  private Integer coinAmount;

  @NotNull
  @Column(name = "payment_amount", nullable = false)
  private Integer paymentAmount;

  // 카드결제, 계좌이체, 간편결제, 충전은 "CHARGE", gamemate가 얻은 건 "GAMEMATE_PAYOUT"
  @Size(max = 45)
  @NotNull
  @Column(name = "payment_method", nullable = false, length = 45)
  private String paymentMethod;

  @ColumnDefault("CURRENT_TIMESTAMP")
  @Column(name = "created_at", nullable = false)
  @CreationTimestamp
  private Instant createdAt;

}