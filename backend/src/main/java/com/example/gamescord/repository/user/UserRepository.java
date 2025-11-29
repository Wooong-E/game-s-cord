package com.example.gamescord.repository.user;

import com.example.gamescord.domain.User;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.example.gamescord.domain.QUser.user;

@Repository
public class UserRepository {

    @Autowired
    private SDJpaUserRepository userRepository;
    private EntityManager em;
    private JPAQueryFactory queryFactory;

    public UserRepository(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    public User saveUser(User userEntity) {
        userRepository.save(userEntity);
        return userEntity;
    }


    public Optional<User> findByLoginId(String loginId) {
        User foundUser = queryFactory
                .selectFrom(user)
                .where(user.loginId.eq(loginId))
                .fetchOne();
        return Optional.ofNullable(foundUser);
    }

    public Optional<User> findByEmail(String email) {
        User foundUser = queryFactory
                .selectFrom(user)
                .where(user.email.eq(email))
                .fetchOne();
        return Optional.ofNullable(foundUser);
    }

    public Optional<User> findByResetToken(String resetToken) {
        User foundUser = queryFactory
                .selectFrom(user)
                .where(user.resetToken.eq(resetToken))
                .fetchOne();
        return Optional.ofNullable(foundUser);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }

    // 중복 체크
    public boolean existsById(Long id) {
        Integer count = queryFactory
                .selectOne()
                .from(user)
                .where(user.id.eq(id))
                .fetchFirst();
        return count != null;
    }


    public List<User> findAllById(Iterable<Long> ids) {
        return userRepository.findAllById(ids);
    }

    // 로그인 실패했을때 횟수 증가
    public void incrementLoginFailCount(User userEntity) {
        userEntity.setLoginFailCount(userEntity.getLoginFailCount() + 1);
        userRepository.save(userEntity);
    }

    // 로그인 성공하면 실패 횟수 초기화
    public void resetLoginFailCount(User userEntity) {
        userEntity.setLoginFailCount(0);
        userRepository.save(userEntity);
    }

    public User updateUser(User userEntity) {
        userRepository.save(userEntity);
        return userEntity;
    }
}