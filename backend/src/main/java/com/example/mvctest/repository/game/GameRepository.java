package com.example.mvctest.repository.game;

import com.example.mvctest.domain.Game;
import com.example.mvctest.repository.gamemate.SDJpaGameMateRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class GameRepository {
  @Autowired
  private SDJpaGameRepository gameRepository;
  private EntityManager em;
  private JPAQueryFactory queryFactory;

  public GameRepository(EntityManager em) {
    this.em=em;
    this.queryFactory = new JPAQueryFactory(em);
  }

  public Game findGameById(Long gameId){
    return gameRepository.findById(gameId).orElse(null);
  }

}
