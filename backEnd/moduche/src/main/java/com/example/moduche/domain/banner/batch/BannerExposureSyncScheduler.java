//package com.example.moduche.domain.banner.batch;
//
//import java.util.Set;
//
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import com.example.moduche.domain.banner.repository.BannerApplyRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//public class BannerExposureSyncScheduler {
//	
//	//작성자: 고은설.
//	//기능: 매시 정각에 DB 반영 Batch 제작.
//	
//	private final RedisTemplate<String, Integer> redisTemplate;
//	private final BannerApplyRepository bannerApplyReapository;
//
//	//매시 정각.
//	@Scheduled(cron = "0 0 * * * *")
//	public void syncExposureCounts() {
//
//		Set<String> keys = redisTemplate.keys("banner:exposure:*");
//
//		if (keys == null || keys.isEmpty())
//			return;
//
//		for (String key : keys) {
//			Long applyId = extractId(key);
//
//			Integer count = redisTemplate.opsForValue().get(key);
//			if (count == null || count == 0)
//				continue;
//
//			//DB 누적 증가.
//			bannerApplyRepository.increaseExposureCount(applyId, count);
//
//			//Redis 값 삭제.
//			redisTemplate.delete(key);
//		}
//	}
//
//	private Long extractId(String key) {
//		return Long.valueOf(key.replace("banner:exposure:", ""));
//	}
//}
