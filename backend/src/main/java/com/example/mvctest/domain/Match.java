package com.example.mvctest.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "matches")
public class Match {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "orders_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "users_id", nullable = false)
  private User users;

  @NotNull
  @Column(name = "ordered_users_id", nullable = false)
  private Long orderedUsersId;

  @NotNull
  @Column(name = "order_users_id", nullable = false)
  private Long orderUsersId;

  @NotNull
  @Column(name = "orders_game_id", nullable = false)
  private Long ordersGameId;

  @Size(max = 255)
  @Column(name = "order_status")
  private String orderStatus;

}