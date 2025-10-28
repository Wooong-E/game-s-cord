package com.example.mvctest.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "gamemates")
public class Gamemate {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "gamemates_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "users_id", nullable = false)
  private User users;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "games_id", nullable = false)
  private Game games;

  @NotNull
  @Column(name = "price", nullable = false)
  private Long price;

  @Size(max = 50)
  @Column(name = "tier", length = 50)
  private String tier;

  @Size(max = 500)
  @Column(name = "tier_screenshot_url", length = 500)
  private String tierScreenshotUrl;

  @Size(max = 100)
  @Column(name = "available_time", length = 100)
  private String availableTime;

  @Size(max = 10)
  @Column(name = "gender", length = 10)
  private String gender;


}