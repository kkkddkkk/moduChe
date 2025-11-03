package com.example.moduche.global.AWS.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AWSService {

	private final AmazonS3 amazonS3;
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	public String upload(MultipartFile file, String folder) {
		try {
			// 파일명 (충돌 방지).
			String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

			// 폴더 경로 포함된 key 생성
			String key = folder + "/" + fileName;
			// 메타데이터 설정
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(file.getSize());
			metadata.setContentType(file.getContentType());

			amazonS3.putObject(new PutObjectRequest(bucket, key, file.getInputStream(), metadata));

			return amazonS3.getUrl(bucket, key).toString();

		} catch (Exception e) {
			throw new RuntimeException("S3 업로드 실패: " + e.getMessage(), e);
		}
	}

}
