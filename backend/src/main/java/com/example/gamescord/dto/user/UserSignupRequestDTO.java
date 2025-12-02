package com.example.gamescord.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSignupRequestDTO {

    @NotBlank(message = "로그인 ID는 필수입니다")
    @Size(min = 6, max = 20, message = "로그인 ID는 6~20자 사이여야 합니다")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 255, message = "비밀번호는 8~255자 사이여야 합니다")
    private String loginPwd;

    @NotBlank(message = "이메일은 필수입니다.")
    @jakarta.validation.constraints.Email(message = "유효한 이메일 주소여야 합니다.")
    @Size(max = 255, message = "이메일은 255자 이하여야 합니다.")
    private String email; // 이메일 필드 추가

    @NotBlank(message = "인증 코드는 필수입니다.")
    private String verificationCode; // 인증 코드 필드 추가

    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(min = 2, max = 10, message = "사용자 이름은 2~10자 사이여야 합니다")
    private String usersName;

    @Size(min = 10, max = 255, message = "사용자 설명은 10~255자 사이여야 합니다")
    private String usersDescription;

    @NotNull(message = "생년월일은 필수입니다")
    @Past(message = "생년월일은 과거 날짜여야 합니다")
    private LocalDate usersBirthday;

    // gender: "None"으로 저장.
}