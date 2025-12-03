package com.example.gamescord.repository.gamemate;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.QGamemate;
import com.example.gamescord.domain.QReview;
import com.querydsl.jpa.impl.JPAQuery;
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
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    public void saveGamemate(Gamemate gamemate) {
        gameMateRepository.save(gamemate);
    }

    public Gamemate findGamemateByUsersId(Long usersId, Long gamesId) {
        return queryFactory.select(gamemate)
                .from(gamemate)
                .where(gamemate.users.id.eq(usersId), gamemate.games.id.eq(gamesId))
                .fetchOne();
    }

    public List<Gamemate> findGamematesByUsersName(String name) {
        return queryFactory.select(gamemate)
                .from(gamemate)
                .where(gamemate.users.usersName.contains(name))
                .orderBy(gamemate.users.usersName.asc())
                .fetch();
    }

    // 통합 필터링 및 정렬 메소드
    public List<Gamemate> findWithFiltersAndSort(Long gameId, String gender, String tier, String sortBy) {
        QGamemate gamemate = QGamemate.gamemate;
        QReview review = QReview.review;

        JPAQuery<Gamemate> query = queryFactory.selectFrom(gamemate);

        // WHERE 절: 필수 조건인 gameId 추가
        query.where(gamemate.games.id.eq(gameId));

        // WHERE 절: 성별 필터 (값이 있고 "모두"가 아닐 경우)
        if (gender != null && !gender.equalsIgnoreCase("모두") && !gender.isEmpty()) {
            query.where(gamemate.users.gender.eq(gender));
        }

        // WHERE 절: 티어 필터 (값이 있고 "상관없이"가 아닐 경우)
        if (tier != null && !tier.equalsIgnoreCase("모두") && !tier.isEmpty()) {
            query.where(gamemate.tier.eq(tier));
        }

        // ORDER BY 절: 정렬 기준 처리
        String effectiveSortBy = (sortBy == null || sortBy.isEmpty()) ? "reviewsScore" : sortBy;

        // 리뷰 관련 정렬 시에만 조인 및 그룹화 수행
        if ("reviewsScore".equals(effectiveSortBy) || "reviewsCount".equals(effectiveSortBy)) {
            query.leftJoin(review).on(review.gamemates.eq(gamemate));
            query.groupBy(gamemate.id);
        }

        switch (effectiveSortBy) {
            case "reviewsScore":
                query.orderBy(review.score.sum().coalesce(0).desc());
                break;
            case "reviewsCount":
                query.orderBy(review.count().desc());
                break;
            case "highPrice":
                query.orderBy(gamemate.price.desc());
                break;
            case "lowPrice":
                query.orderBy(gamemate.price.asc());
                break;
        }

        return query.fetch();
    }

    public List<Gamemate> findGamematesByUsersId(Long userId) {
        return queryFactory.selectFrom(gamemate)
                .where(gamemate.users.id.eq(userId))
                .fetch();
    }

    public List<Gamemate> findAllByIds(List<Long> ids) {
        return gameMateRepository.findAllById(ids);
    }

    public void deleteGamemate(Gamemate gamemate) {
        gameMateRepository.deleteById(gamemate.getId());
    }

}
