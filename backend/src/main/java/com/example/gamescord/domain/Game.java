package com.example.gamescord.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "games")
public class Game {
  @Id
  @Column(name = "games_id", nullable = false)
  private Long id;

  @Size(max = 255)
  @NotNull
  @Column(name = "games_name", nullable = false)
  private String gamesName;

}