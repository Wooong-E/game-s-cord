package com.example.mvctest.repository.mark;

import com.example.mvctest.domain.Mark;
import com.example.mvctest.domain.QMark;
import com.example.mvctest.repository.match.SDJpaMatchRepository;
import com.querydsl.core.QueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.mvctest.domain.QMark.mark;

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

  public List<Mark> findByUsersId(Long usersId){
    return queryFactory.select(mark)
        .from(mark)
        .where(mark.users.id.eq(usersId))
        .fetch();
  }

  public void deleteMark(Mark mark) {
    markRepository.delete(mark);
  }
}
