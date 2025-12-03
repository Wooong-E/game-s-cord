package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "users_id", nullable = false)
  private Long id;

  @Size(max = 255, min = 6)
  @NotNull
  @Column(name = "login_id", nullable = false, unique = true)
  private String loginId;

  @Size(max = 255, min = 8)
  @NotNull
  @Column(name = "login_pwd", nullable = false)
  private String loginPwd;

  @Size(max = 255)
  @NotNull
  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @NotNull
  @Column(name = "point", nullable = false)
  private Long point;

  @Size(max = 10, min = 2)
  @NotNull
  @Column(name = "users_name", nullable = false, length = 10)
  private String usersName;

  @Size(max = 255, min = 10)
  @Column(name = "users_description")
  private String usersDescription;

  @NotNull
  @Column(name = "users_birthday", nullable = false)
  private LocalDate usersBirthday;

  @Size(max = 10)
  @NotNull
  @Column(name = "gender", nullable = false, length = 10)
  private String gender;

  @Size(max = 500)
  @Column(name = "profile_image_url", length = 500)
  private String profileImageUrl;

  @NotNull
  @ColumnDefault("0")
  @Column(name = "login_fail_count", nullable = false)
  private Integer loginFailCount;

  @Column(name = "lockout_until")
  private LocalDateTime lockoutUntil;

  @OneToMany(mappedBy="users")
  private List<File> files = new ArrayList<>();
  @Column(name = "enabled", nullable = false)
  private boolean enabled = false;

}
