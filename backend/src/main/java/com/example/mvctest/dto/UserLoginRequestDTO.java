package com.example.mvctest.dto;

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
    private String loginId;

    @NotBlank(message = "비밀번호는 필수입니다")
    private String loginPwd;
}