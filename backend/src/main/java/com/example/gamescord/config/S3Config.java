package com.example.gamescord.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

  @Value("${cloud.aws.region.static}")
  private String region;

  @Bean
  public S3Client s3Client() {
    // AWS SDK v2를 사용하여 S3Client를 빌드합니다.
    // 별도의 credential을 지정하지 않으면, IAM 역할 (DefaultAWSCredentialsProviderChain)을 자동으로 사용합니다.
    return S3Client.builder()
        .region(Region.of(region)) // application.properties에서 읽어온 리전 설정
        .build();
  }
}
