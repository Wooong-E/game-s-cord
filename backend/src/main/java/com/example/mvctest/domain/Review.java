package com.example.mvctest.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "reviews")
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "reviews_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "gamemates_id", nullable = false)
  private Gamemate gamemates;

  @NotNull
  @Column(name = "score", nullable = false)
  private Integer score;

  @Size(max = 255)
  @Column(name = "review")
  private String review;

}