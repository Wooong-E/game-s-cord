package com.example.gamescord.repository.gamemate;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.QGamemate;
import com.example.gamescord.domain.QReview;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.gamescord.domain.QGamemate.gamemate;
import static com.example.gamescord.domain.QReview.review;

@Repository
public class GameMateRepository {

    @Autowired
    private SDJpaGameMateRepository gameMateRepository;
    private EntityManager em;
    private JPAQueryFactory queryFactory;

    public GameMateRepository(EntityManager em) {
        this.em=em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    public void saveGamemate(Gamemate gamemate){
        gameMateRepository.save(gamemate);
    }

    public Gamemate findGamemateByUsersId(Long usersId,Long gamesId){
        return queryFactory.select(gamemate)
                .from(gamemate)
                .where(gamemate.users.id.eq(usersId),gamemate.games.id.eq(gamesId))
                .fetchOne();
    }

    public List<Gamemate> findGamematesByUsersName(String name){
        return queryFactory.select(gamemate)
                .from(gamemate)
                .where(gamemate.users.usersName.eq(name))
                .orderBy(gamemate.users.usersName.asc())
                .fetch();
    }

    public List<Gamemate> findByGameId(Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .where(gamemate.games.id.eq(gameId))
            .fetch();
    }

    public List<Gamemate> findByGenderAndReviewsCount(String gender, Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .leftJoin(review).on(review.gamemates.eq(gamemate))
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(review.count().desc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndReviewsScore(String gender, Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .leftJoin(review).on(review.gamemates.eq(gamemate))
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(review.score.sum().coalesce(0).desc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndHighCost(String gender, Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(gamemate.price.desc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndLowCost(String gender, Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(gamemate.price.asc())
            .fetch();
    }

    public List<Gamemate> findByTier(String tier, Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .where(gamemate.tier.eq(tier),gamemate.games.id.eq(gameId))
            .fetch();
    }

    public List<Gamemate> findByReviewsCount(Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .leftJoin(review).on(review.gamemates.eq(gamemate))
            .where(gamemate.games.id.eq(gameId))
            .groupBy(gamemate)
            .orderBy(review.count().desc())
            .fetch();
    }

    public List<Gamemate> findByReviewsScore(Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .leftJoin(review).on(review.gamemates.eq(gamemate))
            .where(gamemate.games.id.eq(gameId))
            .groupBy(gamemate)
            .orderBy(review.score.sum().coalesce(0).desc())
            .fetch();
    }

    public List<Gamemate> findByHighPrice(Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .orderBy(gamemate.price.desc())
            .fetch();
    }

    public List<Gamemate> findByLowPrice(Long gameId){
        return queryFactory.select(gamemate)
            .from(gamemate)
            .orderBy(gamemate.price.asc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndTierAndReviewsCount(String gender, String tier, Long gameId) {
        return queryFactory.select(gamemate)
            .from(gamemate)
            .leftJoin(review).on(review.gamemates.eq(gamemate))
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.tier.eq(tier),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(review.count().desc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndTierAndReviewsScore(String gender, String tier, Long gameId) {
        return queryFactory.select(gamemate)
            .from(gamemate)
            .leftJoin(review).on(review.gamemates.eq(gamemate))
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.tier.eq(tier),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(review.score.sum().coalesce(0).desc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndTierAndHighPrice(String gender, String tier, Long gameId) {
        return queryFactory.select(gamemate)
            .from(gamemate)
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.tier.eq(tier),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(gamemate.price.desc())
            .fetch();
    }

    public List<Gamemate> findByGenderAndTierAndLowPrice(String gender, String tier, Long gameId) {
        return queryFactory.select(gamemate)
            .from(gamemate)
            .where(
                gamemate.users.gender.eq(gender),
                gamemate.tier.eq(tier),
                gamemate.games.id.eq(gameId)
            )
            .groupBy(gamemate)
            .orderBy(gamemate.price.asc())
            .fetch();
    }

    public List<Gamemate> findGamematesByUsersId(Long userId) {
        return queryFactory.selectFrom(gamemate)
                .where(gamemate.users.id.eq(userId))
                .fetch();
    }

    public List<Gamemate> findAllByIds(List<Long> ids) {
        return gameMateRepository.findAllById(ids);
    }

    public void deleteGamemate(Gamemate gamemate){
        gameMateRepository.deleteById(gamemate.getId());
    }
}