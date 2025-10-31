/*package com.example.gamescord.service.review;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.Review;
import com.example.gamescord.dto.review.ReviewRequestDTO;
import com.example.gamescord.dto.review.ReviewResponseDTO;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import com.example.gamescord.repository.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final GameMateRepository gameMateRepository;

    @Transactional
    public ReviewResponseDTO createReview(Long gamemateId, ReviewRequestDTO requestDto) {
        Gamemate gamemate = Optional.ofNullable(gameMateRepository.findById(gamemateId))
                .orElseThrow(() -> new IllegalArgumentException("게임메이트 정보를 찾을 수 없습니다."));

        Review newReview = new Review();
        newReview.setGamemates(gamemate);
        newReview.setScore(requestDto.getScore());
        newReview.setReview(requestDto.getReview());

        reviewRepository.save(newReview);

        return ReviewResponseDTO.fromEntity(newReview);
    }
}
*/