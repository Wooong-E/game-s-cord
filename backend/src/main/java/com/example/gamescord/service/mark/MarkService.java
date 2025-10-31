package com.example.gamescord.service.mark;

import com.example.gamescord.domain.Mark;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.mark.MarkedUserResponseDTO;
import com.example.gamescord.dto.mark.MarkResponseDTO;
import com.example.gamescord.repository.UserRepository;
import com.example.gamescord.repository.mark.MarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarkService {

    private final MarkRepository markRepository;
    private final UserRepository userRepository;

    @Transactional
    public MarkResponseDTO addMark(Long markingUserId, Long markedUserId) {
        if (markingUserId.equals(markedUserId)) {
            throw new IllegalArgumentException("자기 자신을 즐겨찾기할 수 없습니다.");
        }

        User markingUser = userRepository.findById(markingUserId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!userRepository.existsById(markedUserId)) {
            throw new IllegalArgumentException("즐겨찾기할 사용자를 찾을 수 없습니다.");
        }

        // Check for duplicate mark
        if (markRepository.findByUsersIdAndMarkedUsersId(markingUserId, markedUserId) != null) {
            throw new IllegalArgumentException("이미 즐겨찾기한 사용자입니다.");
        }

        Mark newMark = new Mark();
        newMark.setUsers(markingUser);
        newMark.setMarkedUsersId(markedUserId);

        markRepository.saveMark(newMark);

        return MarkResponseDTO.fromEntity(newMark);
    }

    @Transactional(readOnly = true)
    public List<MarkedUserResponseDTO> getMarkedUsers(Long markingUserId) {
        List<Mark> marks = markRepository.findMarkByUsersId(markingUserId);

        if (marks.isEmpty()) {
            return List.of(); // Return empty list if no marks
        }

        List<Long> markedUserIds = marks.stream()
                .map(Mark::getMarkedUsersId)
                .collect(Collectors.toList());

        Map<Long, User> markedUsersMap = userRepository.findAllById(markedUserIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return marks.stream()
                .map(mark -> {
                    User markedUser = markedUsersMap.get(mark.getMarkedUsersId());
                    if (markedUser != null) {
                        return MarkedUserResponseDTO.fromEntity(markedUser);
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMark(Long markingUserId, Long markedUserId) {
        Mark markToDelete = markRepository.findByUsersIdAndMarkedUsersId(markingUserId, markedUserId);

        if (markToDelete == null) {
            throw new IllegalArgumentException("해당 사용자가 즐겨찾기 목록에 없습니다.");
        }

        markRepository.deleteMark(markToDelete);
    }
}
