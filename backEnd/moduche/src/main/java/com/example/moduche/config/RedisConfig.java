//package com.example.moduche.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.serializer.GenericToStringSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//@Configuration
//public class RedisConfig {
//	
//	//작성자: 고은설.
//	//기능: Integer기반 Redis 템플릿으로 노출 수 카운트.
//	@Bean
//    public RedisTemplate<String, Integer> redisTemplate(RedisConnectionFactory connectionFactory) {
//        RedisTemplate<String, Integer> template = new RedisTemplate<>();
//        template.setConnectionFactory(connectionFactory);
//
//        // Key = 문자열.
//        template.setKeySerializer(new StringRedisSerializer());
//        template.setHashKeySerializer(new StringRedisSerializer());
//
//        // Value = 숫자(Integer).
//        template.setValueSerializer(new GenericToStringSerializer<>(Integer.class));
//        template.setHashValueSerializer(new GenericToStringSerializer<>(Integer.class));
//
//        template.afterPropertiesSet();
//        return template;
//    }
//}
