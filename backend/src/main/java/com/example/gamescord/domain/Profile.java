package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "profiles")
public class Profile {
  @Id
  @Column(name = "profiles_id", nullable = false)
  private Long id;

  @Size(max = 255)
  @NotNull
  @Column(name = "images_url", nullable = false)
  private String imagesUrl;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "gamemates_id", nullable = false)
  private Gamemate gamemate;

}
