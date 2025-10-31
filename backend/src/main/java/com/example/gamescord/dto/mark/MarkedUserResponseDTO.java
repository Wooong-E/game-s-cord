package com.example.gamescord.dto.mark;

import com.example.gamescord.domain.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MarkedUserResponseDTO {
    private Long markedUserId;
    private String markedUserName;
    private String markedUserProfileImageUrl;

    public static MarkedUserResponseDTO fromEntity(User markedUser) {
        return MarkedUserResponseDTO.builder()
                .markedUserId(markedUser.getId())
                .markedUserName(markedUser.getUsersName())
                .markedUserProfileImageUrl(markedUser.getProfileImageUrl())
                .build();
    }
}
