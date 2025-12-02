package com.example.gamescord.repository.profile;

import com.example.gamescord.domain.Profile;
import com.example.gamescord.repository.coin.SDJpaCoinRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ProfileRepository {
  @Autowired
  private SDJpaProfileRepository profileRepository;
  private EntityManager em;
  private JPAQueryFactory queryFactory;

  public ProfileRepository(EntityManager em) {
    this.em=em;
    this.queryFactory = new JPAQueryFactory(em);
  }

  public Profile save(Profile profile) {
    return profileRepository.save(profile);
  }
}
