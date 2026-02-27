package com.example.gamescord.repository.usercoupon;

import com.example.gamescord.domain.Usercoupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaUserCouponRepository extends JpaRepository<Usercoupon, Long> {
}