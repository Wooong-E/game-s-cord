package com.example.gamescord.domain;

import com.example.gamescord.dto.user.UserResponseDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "users_id", nullable = false)
  private Long id;

  @Size(max = 255)
  @NotNull
  @Column(name = "login_id", nullable = false, unique = true)
  private String loginId;

  @Size(max = 255)
  @NotNull
  @Column(name = "login_pwd", nullable = false)
  private String loginPwd;

  @NotNull
  @Column(name = "point", nullable = false)
  private Long point;

  @Size(max = 10)
  @NotNull
  @Column(name = "users_name", nullable = false, length = 10)
  private String usersName;

  @Size(max = 255)
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
}
