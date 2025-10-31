package com.example.gamescord.repository.game;

import com.example.gamescord.domain.Game;
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

  public Game findGameById(Long id) {
    return gameRepository.findById(id).orElse(null);
  }

}

