package com.example.moduche.global.AWS.service;

import java.net.URL;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
public class AwsS3UrlSigner implements S3UrlSigner {
	private final S3Presigner presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public AwsS3UrlSigner(S3Presigner presigner) {
        this.presigner = presigner;
    }

    @Override
    public URL sign(String objectKey, Duration ttl) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(ttl)
                .getObjectRequest(getObjectRequest)
                .build();

        return presigner.presignGetObject(presignRequest).url();
    }
}
