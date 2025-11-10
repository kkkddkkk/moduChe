package com.example.moduche.global.AWS.service;

import java.net.URL;
import java.time.Duration;

public interface S3UrlSigner {
	URL sign(String objectKey, Duration ttl);
}