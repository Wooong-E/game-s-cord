package com.example.gamescord.repository.file;

import com.example.gamescord.domain.File;
import com.example.gamescord.domain.Profile;
import com.example.gamescord.repository.profile.SDJpaProfileRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class FileRepository {
  @Autowired
  private SDJpaFileRepository fileRepository;
  private EntityManager em;
  private JPAQueryFactory queryFactory;

  public FileRepository(EntityManager em) {
    this.em=em;
    this.queryFactory = new JPAQueryFactory(em);
  }

  public File save(File file) {
    return fileRepository.save(file);
  }

  public void delete(File file) {
    fileRepository.delete(file);
  }
}
