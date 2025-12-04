package com.example.gamescord.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequestDTO {

    @NotBlank(message = "로그인 ID는 필수입니다")
    @Size(min = 4, max = 255, message = "로그인 ID는 255자 이하여야 합니다")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 6, max = 255, message = "비밀번호는 255자 이하여야 합니다")
    private String loginPwd;
}
