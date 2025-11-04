package com.example.gamescord.repository.match;

import com.example.gamescord.domain.Match;
import com.example.gamescord.domain.QMatch;
import com.querydsl.core.QueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static com.example.gamescord.domain.QMatch.match;

@Repository
public class MatchRepository {

    @Autowired
    private SDJpaMatchRepository matchRepository;
    private EntityManager em;
    private JPAQueryFactory queryFactory;

    public MatchRepository(EntityManager em) {
        this.em=em;
        this.queryFactory= new JPAQueryFactory(em);
    }

    public void saveMatch(Match match) {
        matchRepository.save(match);
    }

    public Optional<Match> findById(Long id) {
        return matchRepository.findById(id);
    }

    public Match findPendingMatch(Long usersId, Long order, Long ordered, Long game) {
        return queryFactory.selectFrom(match)
                .where(match.users.id.eq(usersId),
                        match.orderedUsersId.eq(ordered),
                        match.orderUsersId.eq(order),
                        match.ordersGameId.eq(game),
                        match.orderStatus.eq("PENDING"))
                .fetchOne();
    }

    public void deleteMatch(Match match){
        matchRepository.deleteById(match.getId());
    }

    public boolean existsCompletedMatch(Long userA, Long userB, Long gameId) {
        Integer count = queryFactory.selectOne()
                .from(match)
                .where(
                        (match.orderUsersId.eq(userA).and(match.orderedUsersId.eq(userB)))
                        .or(match.orderUsersId.eq(userB).and(match.orderedUsersId.eq(userA)))
                        .and(match.ordersGameId.eq(gameId))
                        .and(match.orderStatus.eq("ACCEPTED"))
                )
                .fetchFirst();
        return count != null;
    }
}