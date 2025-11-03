package com.example.moduche.global.service;

import java.io.BufferedReader;
import java.io.File;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.repository.FacilityRepository;
import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

@Service
public class CsvService {

	private FacilityRepository facilityRepository;

	public CsvService(FacilityRepository facilityRepository) {
		this.facilityRepository = facilityRepository;
	}

	@Transactional
	public void importCsv(File file) throws Exception {
	    // CSVParser 옵션 (콤마 구분)
	    CSVParser parser = new CSVParserBuilder()
	            .withSeparator(',')
	            .build();

	    // try-with-resources로 자동 닫기
	    try (BufferedReader br = Files.newBufferedReader(file.toPath(), StandardCharsets.UTF_8);
	         CSVReader reader = new CSVReaderBuilder(br)
	                 .withCSVParser(parser)
	                 .withSkipLines(1) // 헤더 스킵
	                 .build()) {

	        List<Facility> batchList = new ArrayList<>();
	        int batchSize = 1000;
	        String[] line;

	        while ((line = reader.readNext()) != null) {
	            // CSV 값 trim 처리
	            String facilityName = line[0] != null ? line[0].trim() : null;
	            String facilityPhone = (line[1] != null && !line[1].isEmpty()) ? "0" + line[1].trim() : null;
	            String facilityAddress = line[2] != null ? line[2].trim() : null;
	            String facilityType = line[3] != null ? line[3].trim() : null;
	            BigDecimal geoLng = (line[4] != null && !line[4].isEmpty()) ? new BigDecimal(line[4].trim()) : BigDecimal.ZERO;
	            BigDecimal geoLat = (line[5] != null && !line[5].isEmpty()) ? new BigDecimal(line[5].trim()) : BigDecimal.ZERO;

	            Facility facility = new Facility();
	            facility.setFacilityName(facilityName);
	            facility.setFacilityPhone(facilityPhone);
	            facility.setFacilityAddress(facilityAddress);
	            facility.setFacilityType(facilityType);
	            facility.setGeoLng(geoLng);
	            facility.setGeoLat(geoLat);

	            batchList.add(facility);

	            if (batchList.size() >= batchSize) {
	                facilityRepository.saveAll(batchList);
	                batchList.clear();
	            }
	        }

	        // 남은 데이터 저장
	        if (!batchList.isEmpty()) {
	            facilityRepository.saveAll(batchList);
	        }
	    }
	}
}
