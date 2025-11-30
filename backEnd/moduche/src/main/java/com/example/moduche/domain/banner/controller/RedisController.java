//package com.example.moduche.domain.banner.controller;
//
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class RedisController {
//	
//	private final RedisTemplate<String, Integer> redisTemplate;
//
//    public RedisController(RedisTemplate<String, Integer> redisTemplate) {
//        this.redisTemplate = redisTemplate;
//    }
//
//    @GetMapping("/api/redis/test")
//    public String testRedis() {
//        redisTemplate.opsForValue().set("test:key", 123);
//        Integer value = redisTemplate.opsForValue().get("test:key");
//        return "Redis value = " + value;
//    }
//}
