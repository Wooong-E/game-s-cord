package com.example.gamescord.service.s3;

// S3Service.java

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

  private final S3Client s3Client;
  private final String bucketName;
  private final String region;

  // 생성자 주입
  public S3Service(S3Client s3Client,
                   @Value("${cloud.aws.s3.bucket}") String bucketName,
                   @Value("${cloud.aws.region.static}") String region) {
    this.s3Client = s3Client;
    this.bucketName = bucketName;
    this.region = region;
  }

  /**
   * S3에 파일을 업로드하고, 저장된 파일의 URL을 반환합니다.
   * @param file 클라이언트로부터 받은 MultipartFile
   * @return S3 객체 URL
   * @throws IOException 파일 처리 중 발생한 오류
   */
  public String uploadFile(MultipartFile file) throws IOException {
    // 파일의 고유 이름 생성 (중복 방지)
    String originalFilename = file.getOriginalFilename();
    String uniqueFileName = UUID.randomUUID().toString() + "-" + originalFilename;

    // 1. S3에 파일 업로드 요청 생성
    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
        .bucket(bucketName)
        .key(uniqueFileName) // S3에 저장될 경로 및 파일 이름
        .contentType(file.getContentType()) // 파일 타입 지정 (MIME Type)
        .contentLength(file.getSize()) // 파일 크기 지정
        // ACL을 지정할 수 있지만, 일반적으로는 IAM 역할과 버킷 정책으로 제어합니다.
        .build();

    // 2. 파일 데이터 전송
    s3Client.putObject(putObjectRequest,
        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

    // 3. 저장된 파일의 URL 반환 (이 URL을 RDS DB에 저장합니다)
    // URL 형식: https://[버킷이름].s3.[리전].amazonaws.com/[키]
    return String.format("https://%s.s3.%s.amazonaws.com/%s",
        bucketName,
        region,
        uniqueFileName);
  }

  // 선택 사항: 파일 삭제 로직
  public void deleteFile(String s3Url) {
    // URL에서 파일 키 (uniqueFileName) 추출 로직 필요...
    String key = extractKeyFromUrl(s3Url);

    s3Client.deleteObject(r -> r.bucket(bucketName).key(key));
  }

  // (URL 파싱 로직은 생략)
  private String extractKeyFromUrl(String s3Url) {
    // 실제 구현 시 URL에서 'bucketName.s3.region.amazonaws.com/' 이후의 문자열을 파싱해야 합니다.
    // 편의상 간단한 replace 예시
    String prefix = String.format("https://%s.s3.%s.amazonaws.com/", bucketName, region);
    return s3Url.replace(prefix, "");
  }
}
