// 작성자: 고은설.
// 기능: AWS SDK v2 기반의 S3 파일 업로드 및 Pre-Signed URL 발급 서비스.
package com.example.moduche.global.AWS.service;

import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class AWSService {

	private final S3Client s3Client; // AWS SDK v2의 S3Client.
	private final S3UrlSigner signer; // 사전 서명 URL 발급 인터페이스.

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	// 파일 업로드.
	public String upload(MultipartFile file, String folder) {
		try {
			// 고유 파일명 생성.
			String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
			String key = folder + "/" + fileName;

			// 요청 객체 생성.
			PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucket).key(key)
					.contentType(file.getContentType()).build();

			// 파일 업로드 실행.
			s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

			// 업로드 완료된 파일의 URL 구성.
			return key;

		} catch (Exception e) {
			throw new RuntimeException("S3 업로드 실패: " + e.getMessage(), e);
		}
	}

	// 사전 서명 URL 발급.
	public String toPreSignedUrl(String objectKey, Duration ttl) {
		URL url = signer.sign(objectKey, ttl);
		return url.toString();
	}

	//단일 키에 대한 이미지 삭제(aka.단일 삭제).
	public void deletePhoto(String key) {
		s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
	}
	
	//키 목록에 대한 이미지 전체 삭제(aka. 대량 삭제)
	public void deletePhotos(List<String> keys) {

	    if (keys == null || keys.isEmpty()) return;

	    keys.forEach(key ->
	        s3Client.deleteObject(DeleteObjectRequest.builder()
	            .bucket(bucket)
	            .key(key)
	            .build())
	    );
	}
}
