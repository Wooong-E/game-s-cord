package com.example.gamescord.dto.mark;

import com.example.gamescord.domain.Mark;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MarkResponseDTO {

    private Long markId;
    private Long markingUserId; // User who created the mark
    private Long markedUserId;  // User who was marked

    public static MarkResponseDTO fromEntity(Mark mark) {
        return MarkResponseDTO.builder()
                .markId(mark.getId())
                .markingUserId(mark.getUsers().getId())
                .markedUserId(mark.getMarkedUsersId())
                .build();
    }
}
