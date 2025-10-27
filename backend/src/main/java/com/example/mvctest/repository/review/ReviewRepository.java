package com.example.mvctest.repository.review;

import com.querydsl.core.QueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ReviewRepository {

  @Autowired
  private SDJpaReviewRepository reviewRepository;
  private EntityManager em;
  private QueryFactory queryFactory;

  public ReviewRepository(EntityManager em) {
    this.em = em;
    this.queryFactory=new JPAQueryFactory(em);
  }
}
