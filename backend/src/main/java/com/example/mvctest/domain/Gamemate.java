package com.example.mvctest.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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

}