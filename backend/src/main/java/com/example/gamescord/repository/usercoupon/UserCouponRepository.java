package com.example.gamescord.repository.usercoupon;

import com.example.gamescord.domain.*;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.example.gamescord.domain.QCoupon.coupon;
import static com.example.gamescord.domain.QUsercoupon.usercoupon;

@Repository
public class UserCouponRepository {

  @Autowired
  private SDJpaUserCouponRepository userCouponRepository;
  private EntityManager em;
  private JPAQueryFactory queryFactory;

  public UserCouponRepository(EntityManager em) {
    this.em = em;
    this.queryFactory = new JPAQueryFactory(em);
  }

  public Usercoupon saveUserCoupon(Usercoupon uc) {
    userCouponRepository.save(uc);
    return uc;
  }

  public List<Coupon> findCouponByUsersId(User user) {
    List<Coupon> foundCoupon=queryFactory
        .select(usercoupon.coupon)
        .from(usercoupon)
        .where(usercoupon.users.eq(user))
        .fetch();

    return foundCoupon;
  }

  public Usercoupon findUserCouponByUserIdAndCouponId(User user, User serveUser, Coupon coupon) {
    Usercoupon foundUserCoupon=queryFactory
        .selectFrom(usercoupon)
        .where(usercoupon.users.eq(user), usercoupon.sender.eq(serveUser), usercoupon.coupon.eq(coupon))
        .fetchOne();

    return foundUserCoupon;
  }

  public void deleteCoupon(Usercoupon uc) {
    userCouponRepository.deleteById(uc.getId());
  }

}
