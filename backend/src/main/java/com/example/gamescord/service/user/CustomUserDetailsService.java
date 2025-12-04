package com.example.gamescord.service.user;

import com.example.gamescord.domain.User;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Security 의 UserDetailsService 인터페이스를 구현한 커스텀 서비스 클래스입니다.
 * 사용자 인증 시, 사용자 정보를 데이터베이스에서 로드하는 역할을 합니다.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    // 사용자 정보를 데이터베이스에서 조회하기 위한 Repository
    private final UserRepository userRepository;

    /**
     * loginId를 기반으로 사용자 정보를 로드합니다.
     * @param loginId 사용자가 로그인 시 입력한 아이디
     * @return UserDetails 객체 (사용자 정보)
     * @throws UsernameNotFoundException 해당 사용자를 찾을 수 없을 경우 발생하는 예외
     */
    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        // loginId를 이용해 데이터베이스에서 사용자 정보를 조회합니다.
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("해당 아이디를 찾을 수 없습니다: " + loginId));

        // 조회된 사용자 정보를 기반으로 CustomUserDetails 객체를 생성하여 반환합니다.
        // 이 객체는 Spring Security 가 인증 과정에서 사용합니다.
        return new CustomUserDetails(user);
    }
}