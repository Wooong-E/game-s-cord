package com.example.gamescord.service.review;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.Review;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.review.ReviewRequestDTO;
import com.example.gamescord.dto.review.ReviewResponseDTO;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import com.example.gamescord.repository.match.MatchRepository;
import com.example.gamescord.repository.review.ReviewRepository;
import com.example.gamescord.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final GameMateRepository gameMateRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    @Transactional
    public ReviewResponseDTO createReview(Long authorId, Long gamemateId, ReviewRequestDTO requestDto) {
        // 1. 엔티티 조회
        User author = userRepository.findById(authorId);
        Gamemate gamemate = gameMateRepository.findById(gamemateId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰할 게임메이트 정보를 찾을 수 없습니다."));
        User gamemateUser = gamemate.getUsers();

        // 2. 비즈니스 로직 검증
        // 2a. 셀프 리뷰 금지
        if (author.getId().equals(gamemateUser.getId())) {
            throw new IllegalArgumentException("자기 자신을 리뷰할 수 없습니다.");
        }

        // 2b. 중복 리뷰 금지
        if (reviewRepository.existsByGamemateAndUser(gamemateId, authorId)) {
            throw new IllegalArgumentException("이미 해당 게임메이트에 대한 리뷰를 작성했습니다.");
        }

        // 2c. 완료된 매칭이 있는지 확인
        boolean hasCompletedMatch = matchRepository.existsCompletedMatch(
                author.getId(),
                gamemateUser.getId(),
                gamemate.getGames().getId()
        );
        if (!hasCompletedMatch) {
            throw new IllegalArgumentException("리뷰를 작성하려면 먼저 해당 게임메이트와 매칭을 완료해야 합니다.");
        }

        // 3. 리뷰 엔티티 생성 및 저장
        Review newReview = new Review();
        newReview.setUsers(author);
        newReview.setGamemates(gamemate);
        newReview.setScore(requestDto.getScore());
        newReview.setReviewDescription(requestDto.getReview());

        reviewRepository.saveReview(newReview);

        // 4. DTO 변환 및 반환
        return ReviewResponseDTO.fromEntity(newReview);
    }

    @Transactional(readOnly = true)
    public java.util.List<com.example.gamescord.dto.review.ReviewResponseDTO> getReviewsForGamemate(Long gamemateId) {
        java.util.List<com.example.gamescord.domain.Review> reviews = reviewRepository.findAllByGamemateId(gamemateId);
        return reviews.stream()
                .map(com.example.gamescord.dto.review.ReviewResponseDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }
}
