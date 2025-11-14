package com.example.moduche.global.runner;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.moduche.domain.login.repository.UserRoleRepository;

import com.example.moduche.global.service.CourseCsvService;
import com.example.moduche.global.service.CsvService;
import com.example.moduche.util.AESUtil;

@Component
public class CsvRunner implements CommandLineRunner {

	private final UserRoleRepository userRoleRepository;

	private final CsvService csvService;

    public CsvRunner(CsvService csvService, UserRoleRepository userRoleRepository) {
        this.csvService = csvService;
        this.userRoleRepository = userRoleRepository;
    }
    

	@Override
	public void run(String... args) throws Exception {
//        File file = new File("src/main/resources/data/facility.csv"); // CSV 하나 지정
//        csvService.importCsv(file); // DB 삽입
//		File file = new File("src/main/resources/data/course.csv");
//      courseCsvService.importCsv(file);

	}
 
}