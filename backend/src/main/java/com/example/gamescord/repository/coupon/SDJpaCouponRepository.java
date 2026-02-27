package com.example.gamescord.repository.coupon;

import com.example.gamescord.domain.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SDJpaCouponRepository extends JpaRepository<Coupon, Long> {
}