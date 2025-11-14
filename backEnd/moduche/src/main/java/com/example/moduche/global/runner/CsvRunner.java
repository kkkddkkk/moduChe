package com.example.moduche.global.runner;

import java.io.File;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.moduche.global.service.CourseCsvService;
import com.example.moduche.global.service.CsvService;

@Component
public class CsvRunner implements CommandLineRunner {

    private final CourseCsvService courseCsvService;

    public CsvRunner(CourseCsvService courseCsvService) {
        this.courseCsvService = courseCsvService;
    }

    @Override
    public void run(String... args) throws Exception {
//        File file = new File("src/main/resources/data/course.csv");
//        courseCsvService.importCsv(file);
    }
}