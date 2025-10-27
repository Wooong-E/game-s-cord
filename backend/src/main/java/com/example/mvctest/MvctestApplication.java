package com.example.mvctest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

// @SpringBootApplication
// DB 제외한 테스트를 위한 코드
@SpringBootApplication
public class MvctestApplication {
	public static void main(String[] args) {
		SpringApplication.run(MvctestApplication.class, args);
	}

}
