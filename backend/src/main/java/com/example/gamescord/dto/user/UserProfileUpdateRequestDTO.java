package com.example.gamescord.dto.user;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.NotNull; // Added for usersBirthday
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequestDTO {

    @Size(min = 2, max = 10, message = "사용자 이름은 2~10자 사이여야 합니다")
    private String usersName;

    @Size(min = 10, max = 255, message = "사용자 설명은 10~255자 사이여야 합니다")
    private String usersDescription;

    @NotNull(message = "생년월일은 필수입니다")
    @Past(message = "생년월일은 과거 날짜여야 합니다")
    private LocalDate usersBirthday;

    @Size(max = 10, message = "성별은 10자 이하여야 합니다")
    private String gender;

    @Size(max = 500, message = "프로필 이미지 URL은 500자 이하여야 합니다")
    private String profileImageUrl;
}