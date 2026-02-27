package com.example.gamescord.service.usercoupon;

import com.example.gamescord.domain.Coupon;
import com.example.gamescord.domain.User;
import com.example.gamescord.domain.Usercoupon;
import com.example.gamescord.repository.coupon.CouponRepository;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.repository.usercoupon.UserCouponRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserCouponService {

  private final UserRepository userRepository;
  private final UserCouponRepository userCouponRepository;
  private final CouponRepository couponRepository;

  @Transactional
  public void registerCoupon(Long usersId, Long serveUsersId, Long couponId){
    Coupon coupon=couponRepository.findById(couponId).orElse(null);
    if(coupon==null){
      throw new IllegalArgumentException("등록되지 않은 쿠폰입니다.");
    }

    Usercoupon userCoupon=new Usercoupon();
    User user=userRepository.findById(usersId);
    User serveUser=userRepository.findById(serveUsersId);

    userCoupon.setUsers(user);
    userCoupon.setSender(serveUser);
    userCoupon.setCoupon(coupon);
    if(userCoupon.getCreatedAt()==null){
      userCoupon.setCreatedAt(LocalDate.now());
    }

    userCouponRepository.saveUserCoupon(userCoupon);
  }

  @Transactional
  public void deleteUserCoupon(Long usersId, Long serveUserId, Long couponId){
    User user=userRepository.findById(usersId);
    User serveUser=userRepository.findById(serveUserId);
    Coupon coupon=couponRepository.findById(couponId).orElse(null);

    Usercoupon findUserCoupon = userCouponRepository.findUserCouponByUserIdAndCouponId(user, serveUser, coupon);

    userCouponRepository.deleteCoupon(findUserCoupon);
  }

  @Transactional
  public List<Coupon> findUserCoupon(Long usersId){
    User findUser = userRepository.findById(usersId);
    return userCouponRepository.findCouponByUsersId(findUser);
  }
}
