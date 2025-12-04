package com.example.gamescord.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDTO {

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 주소여야 합니다.")
    private String email;

    @NotBlank(message = "인증 코드는 필수입니다.")
    private String code;

    @NotBlank(message = "새 비밀번호는 필수입니다.")
    @Size(min = 6, max = 255, message = "비밀번호는 6~255자 사이여야 합니다.")
    private String newPassword;
}
