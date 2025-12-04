package com.example.gamescord.repository.review;

import com.example.gamescord.domain.Review;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.gamescord.domain.QGamemate.gamemate;
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

    public void saveReview(Review reviewEntity) {
        reviewRepository.save(reviewEntity);
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

    public List<Review> findAllByGamemateId(Long gamemateId) {
        return queryFactory.selectFrom(review)
                .where(review.gamemates.id.eq(gamemateId))
                .orderBy(review.id.desc())
                .fetch();
    }

    public Double findAverageScoreByGamemateId(Long gamemateId) {
        return queryFactory
                .select(review.score.avg())
                .from(review)
                .where(review.gamemates.id.eq(gamemateId))
                .fetchOne();
    }

    public Long countByGamemateId(Long gamemateId) {
        return queryFactory
                .select(review.count())
                .from(review)
                .where(review.gamemates.id.eq(gamemateId))
                .fetchOne();
    }

    public List<Integer> findAllScoresByUserId(Long userId) {
        return queryFactory
                .select(review.score)
                .from(review)
                .join(review.gamemates, gamemate)
                .where(gamemate.users.id.eq(userId))
                .fetch();
    }

    public List<Long> findTop4ByGameIdAndReviewsCount(Long gameId){
        return queryFactory
            .select(review.gamemates.id)
            .from(review)
            .where(review.gamemates.games.id.eq(gameId))
            .groupBy(review.gamemates.id)
            .orderBy(review.count().desc())
            .limit(4)
            .fetch();
    }
}