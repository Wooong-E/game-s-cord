package com.example.gamescord.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Long id;
    private String loginId;
    private Long point;
    private String usersName;
    private String usersDescription;
    private LocalDate usersBirthday;
    private String gender;
    private String profileImageUrl;
}