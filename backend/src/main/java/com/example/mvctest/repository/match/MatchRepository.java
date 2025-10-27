package com.example.mvctest.repository.match;

import com.example.mvctest.domain.Match;
import com.example.mvctest.domain.QMatch;
import com.querydsl.core.QueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import static com.example.mvctest.domain.QMatch.match;

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

  public Match findMatch(Long usersId,Long order,Long ordered,Long game){
    return queryFactory.select(match)
        .from(match)
        .where(match.users.id.eq(usersId), match.orderedUsersId.eq(ordered), match.orderUsersId.eq(order), match.ordersGameId.eq(game))
        .fetchOne();
  }

  public void deleteMatch(Match match){
    matchRepository.deleteById(match.getId());
  }

}
