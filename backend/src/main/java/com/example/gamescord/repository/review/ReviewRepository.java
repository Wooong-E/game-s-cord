package com.example.gamescord.repository.review;

import com.example.gamescord.domain.Review;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static  com.example.gamescord.domain.QReview.review;

@Repository
public class ReviewRepository {

    @Autowired
    private SDJpaReviewRepository reviewRepository;
    private EntityManager em;
    private JPAQueryFactory queryFactory;

    public ReviewRepository(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    // 리뷰 작성
    public void saveReview(Review reviewEntity) {
        reviewRepository.save(reviewEntity);
    }

    // 리뷰 수정
    public void updateReview(Review reviewEntity) {
        reviewRepository.save(reviewEntity);
    }

    // 리뷰 삭제
    public void deleteReview(Review reviewEntity) {
        reviewRepository.delete(reviewEntity);
    }

    public boolean existsByGamemateAndUser(Long gamemateId, Long authorId) {
        Integer count = queryFactory.selectOne()
                .from(review)
                .where(
                        review.gamemates.id.eq(gamemateId)
                        .and(review.users.id.eq(authorId))
                )
                .fetchFirst();
        return count != null;
    }

    public java.util.List<com.example.gamescord.domain.Review> findAllByGamemateId(Long gamemateId) {
        return queryFactory.selectFrom(review)
                .where(review.gamemates.id.eq(gamemateId))
                .orderBy(review.id.desc())
                .fetch();
    }
}