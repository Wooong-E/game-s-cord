package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "usercoupon")
public class Usercoupon {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "usercoupon_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "users_id", nullable = false)
  private User users;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "sender_id", nullable = false)
  private User sender;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "coupon_id", nullable = false)
  private Coupon coupon;

  @NotNull
  @Column(name = "created_at", nullable = false)
  private LocalDate createdAt;

}