package com.example.mvctest.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "marks")
public class Mark {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "marks_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "users_id", nullable = false)
  private User users;

  @NotNull
  @Column(name = "marked_users_id", nullable = false)
  private Long markedUsersId;

}