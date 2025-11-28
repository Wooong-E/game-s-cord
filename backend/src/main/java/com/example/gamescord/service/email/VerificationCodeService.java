package com.example.gamescord.service.email;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationCodeService {

    private static final long EXPIRATION_MINUTES = 5; // 코드 유효 시간 5분
    private final ConcurrentHashMap<String, String> codeStorage = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> expirationStorage = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * 지정된 이메일에 대한 6자리 인증 코드를 생성하고 저장합니다.
     *
     * @param email 인증 코드를 받을 이메일 주소
     * @return 생성된 6자리 인증 코드
     */
    public String generateAndStoreCode(String email) {
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        codeStorage.put(email, code);
        expirationStorage.put(email, LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        return code;
    }

    /**
     * 제공된 이메일과 코드가 유효한지 확인합니다.
     *
     * @param email 검증할 이메일 주소
     * @param code  검증할 인증 코드
     * @return 코드가 유효하면 true, 그렇지 않으면 false
     */
    public boolean verifyCode(String email, String code) {
        String storedCode = codeStorage.get(email);
        LocalDateTime expirationTime = expirationStorage.get(email);

        if (storedCode == null || expirationTime == null) {
            return false; // 코드가 존재하지 않음
        }

        if (LocalDateTime.now().isAfter(expirationTime)) {
            // 만료된 코드는 저장소에서 제거
            codeStorage.remove(email);
            expirationStorage.remove(email);
            return false; // 코드 만료
        }

        if (storedCode.equals(code)) {
            // 인증 성공 시 코드 제거 (일회용)
            codeStorage.remove(email);
            expirationStorage.remove(email);
            return true;
        }

        return false; // 코드가 일치하지 않음
    }
}
