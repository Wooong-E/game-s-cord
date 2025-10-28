package com.example.mvctest.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponseDTO {
    private Long userId;
    private String loginId;
    private String usersName;
    private String usersDescription;
    private LocalDate usersBirthday;
    private String gender;
    private Long point;
    private String profileImageUrl;
}