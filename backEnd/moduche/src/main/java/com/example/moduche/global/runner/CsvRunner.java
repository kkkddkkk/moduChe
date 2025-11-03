package com.example.moduche.global.runner;

import java.io.File;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.moduche.global.service.CsvService;

@Component
public class CsvRunner implements CommandLineRunner {

    private final CsvService csvService;

    public CsvRunner(CsvService csvService) {
        this.csvService = csvService;
    }

    @Override
    public void run(String... args) throws Exception {
//        File file = new File("src/main/resources/data/facility.csv"); // CSV 하나 지정
//        csvService.importCsv(file); // DB 삽입
    }
}