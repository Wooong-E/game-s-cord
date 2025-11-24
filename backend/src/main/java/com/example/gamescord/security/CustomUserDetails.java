package com.example.gamescord.security;

import com.example.gamescord.domain.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security 의 UserDetails 인터페이스를 구현한 커스텀 클래스입니다.
 * 인증된 사용자의 상세 정보(권한, 비밀번호, 아이디 등)를 캡슐화합니다.
 */
@Getter
public class CustomUserDetails implements UserDetails {

    // 애플리케이션의 도메인 모델인 User 객체를 포함합니다.
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    /**
     * @return 사용자의 고유 ID를 반환합니다.
     */
    public Long getId() {
        return user.getId();
    }

    /**
     * 사용자가 가진 권한 목록을 반환합니다.
     * @return 권한 목록
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 현재는 별도의 권한을 설정하지 않으므로 빈 리스트를 반환합니다.
        // 추후 역할(Role) 기반 권한 관리가 필요할 경우, 여기에 로직을 추가합니다.
        return Collections.emptyList();
    }

    /**
     * 사용자의 비밀번호를 반환합니다.
     * @return 암호화된 비밀번호
     */
    @Override
    public String getPassword() {
        return user.getLoginPwd();
    }

    /**
     * 사용자의 아이디를 반환합니다.
     * @return 로그인 아이디
     */
    @Override
    public String getUsername() {
        return user.getLoginId();
    }

    /**
     * 계정이 만료되지 않았는지 여부를 반환합니다.
     * @return true (만료되지 않음)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부 (true: 만료되지 않음)
    }

    /**
     * 계정이 잠기지 않았는지 여부를 반환합니다.
     * @return true (잠기지 않음)
     */
    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠김 여부 (true: 잠기지 않음)
    }

    /**
     * 자격 증명(비밀번호)이 만료되지 않았는지 여부를 반환합니다.
     * @return true (만료되지 않음)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 비밀번호 만료 여부 (true: 만료되지 않음)
    }

    /**
     * 계정이 활성화되었는지 여부를 반환합니다.
     * @return true (활성화됨)
     */
    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화 여부 (true: 활성화됨)
    }
}