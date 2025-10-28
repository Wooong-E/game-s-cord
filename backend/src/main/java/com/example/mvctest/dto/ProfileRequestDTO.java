package com.example.mvctest.dto;

import lombok.*;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequestDTO {

    @Size(max = 10, message = "닉네임은 10자 이하여야 합니다")
    private String usersName;

    @Size(max = 255, message = "자기소개는 255자 이하여야 합니다")
    private String usersDescription;

    private String profileImageUrl;
}