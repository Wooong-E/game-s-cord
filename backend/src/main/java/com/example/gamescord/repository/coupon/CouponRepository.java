package com.example.gamescord.repository.coupon;

import com.example.gamescord.domain.Coupon;
import com.querydsl.core.QueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class CouponRepository {

  @Autowired
  private SDJpaCouponRepository couponRepository;
  private EntityManager em;
  private JPAQueryFactory queryFactory;

  public CouponRepository(EntityManager em) {
    this.em=em;
    this.queryFactory = new JPAQueryFactory(em);
  }

  public Optional<Coupon> findById(Long id) { return couponRepository.findById(id); }
}
