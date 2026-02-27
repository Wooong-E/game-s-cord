package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "coupon")
public class Coupon {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "coupon_id", nullable = false)
  private Long id;

  @Size(max = 255)
  @NotNull
  @Column(name = "coupon_name", nullable = false)
  private String couponName;

}