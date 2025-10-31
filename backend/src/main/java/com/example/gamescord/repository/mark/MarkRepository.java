package com.example.gamescord.repository.mark;

import com.example.gamescord.domain.Mark;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.gamescord.domain.QMark.mark;

@Repository
public class MarkRepository {

    @Autowired
    private SDJpaMarkRepository markRepository;
    private EntityManager em;
    private JPAQueryFactory queryFactory;

    public MarkRepository(EntityManager em) {
        this.em=em;
        this.queryFactory= new JPAQueryFactory(em);
    }

    public void saveMark(Mark mark) {
        markRepository.save(mark);
    }

    public List<Mark> findMarkByUsersId(Long usersId){
        return queryFactory.select(mark)
                .from(mark)
                .where(mark.users.id.eq(usersId))
                .fetch();
    }

    public Mark findByUsersIdAndMarkedUsersId(Long usersId, Long markedUsersId) {
        return queryFactory.select(mark)
            .from(mark)
            .where(mark.users.id.eq(usersId), mark.markedUsersId.eq(markedUsersId))
            .fetchOne();
    }

    public void deleteMark(Mark mark) {
        markRepository.delete(mark);
    }
}
