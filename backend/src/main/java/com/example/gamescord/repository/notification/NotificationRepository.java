package com.example.gamescord.repository.notification;

import com.example.gamescord.domain.Notification;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.example.gamescord.domain.QNotification.notification;

@Repository
public class NotificationRepository {

    @Autowired
    private SDJpaNotificationRepository notificationRepository;
    private EntityManager em;
    private JPAQueryFactory queryFactory;

    public NotificationRepository(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    public void saveNotification(Notification notificationEntity) {
        notificationRepository.save(notificationEntity);
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> findAllByUserId(Long userId) {
        return queryFactory.selectFrom(notification)
                .where(notification.users.id.eq(userId))
                .orderBy(notification.createdAt.desc())
                .fetch();
    }

    public Long countUnreadByUserId(Long userId) {
        return queryFactory.select(notification.count())
                .from(notification)
                .where(
                        notification.users.id.eq(userId)
                                .and(notification.isRead.eq(false))
                )
                .fetchOne();
    }

    public void deleteNotification(Notification notificationEntity) {
        notificationRepository.delete(notificationEntity);
    }
}