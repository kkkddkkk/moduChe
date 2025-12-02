package com.example.moduche.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableAsync          
@Configuration 
public class SchedulerConfig {

	//작성자: 고은설.
	//기능: 다른 스케줄러 파일을 감지하는 스프링 설정 클래스.
	//당부: 비어있어 보여도 이녀석이 없으면 @Scheduled 붙은 배치 작업이 일괄 수행이 안 되니 남겨주세요.
}
