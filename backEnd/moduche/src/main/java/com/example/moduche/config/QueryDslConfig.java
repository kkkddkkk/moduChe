package com.example.moduche.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

@Configuration
public class QueryDslConfig {
	  @Bean
	    public JPAQueryFactory jpaQueryFactory(EntityManager entityManager) {
	        //EntityManager를 주입받아 QueryDSL 팩토리 생성.
	        return new JPAQueryFactory(entityManager);
	    }
}
