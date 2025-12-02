package com.example.gamescord.service.coin;

import com.example.gamescord.domain.Coin;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.coin.*;
import com.example.gamescord.repository.coin.CoinRepository;
import com.example.gamescord.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoinService {

    private final UserRepository userRepository;
    private final CoinRepository coinRepository;

    private static final Map<Integer, CoinPackageInfo> COIN_PACKAGES = Map.of(
            1, new CoinPackageInfo(500, 4680),
            2, new CoinPackageInfo(1000, 9360),
            3, new CoinPackageInfo(2000, 18720),
            4, new CoinPackageInfo(5000, 45600),
            5, new CoinPackageInfo(10000, 91200),
            6, new CoinPackageInfo(30000, 266400),
            7, new CoinPackageInfo(50000, 444000),
            8, new CoinPackageInfo(100000, 864000),
            9, new CoinPackageInfo(300000, 2592000),
            10, new CoinPackageInfo(500000, 432000)
    );

    @Transactional(readOnly = true)
    public PrepareChargeResponseDTO prepareCharge(PrepareChargeRequestDTO requestDto) {
        CoinPackageInfo packageInfo = COIN_PACKAGES.get(requestDto.getPackageId());
        if (packageInfo == null) {
            throw new IllegalArgumentException("존재하지 않는 패키지입니다.");
        }

        List<String> paymentMethods = List.of("카드결제", "계좌이체", "간편 결제");

        return PrepareChargeResponseDTO.builder()
                .coinAmount(packageInfo.coinAmount())
                .paymentAmount(packageInfo.paymentAmount())
                .paymentMethods(paymentMethods)
                .build();
    }

    @Transactional
    public CoinResponseDTO chargeCoin(String loginId, CoinChargeRequestDTO requestDto) {
        CoinPackageInfo packageInfo = COIN_PACKAGES.get(requestDto.getPackageId());
        if (packageInfo == null) {
            throw new IllegalArgumentException("존재하지 않는 패키지입니다.");
        }

        List<String> validPaymentMethods = List.of("카드결제", "계좌이체", "간편결제");
        if (!validPaymentMethods.contains(requestDto.getPaymentMethod())) {
            throw new IllegalArgumentException("유효하지 않은 결제 수단입니다.");
        }

        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPoint(user.getPoint() + packageInfo.coinAmount());
        userRepository.saveUser(user);

        Coin newCoin = new Coin();
        newCoin.setUsers(user);
        newCoin.setCoinAmount(packageInfo.coinAmount()); // 양수
        newCoin.setPaymentAmount(packageInfo.paymentAmount());
        newCoin.setPaymentMethod(requestDto.getPaymentMethod()); // Set payment method from request
        Coin savedCoin = coinRepository.save(newCoin);

        return CoinResponseDTO.success("코인이 성공적으로 충전되었습니다.", savedCoin, user.getPoint());
    }

    @Transactional(readOnly = true)
    public List<CoinHistoryResponseDTO> getCoinHistory(String loginId) {
        List<Coin> coinHistory = coinRepository.findByUserLoginId(loginId);
        return coinHistory.stream()
                .map(CoinHistoryResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CoinResponseDTO refundCoin(String loginId, CoinRefundRequestDTO requestDto) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Coin coinToRefund = coinRepository.findById(requestDto.getCoinId())
                .orElseThrow(() -> new IllegalArgumentException("환불할 거래 내역을 찾을 수 없습니다."));

        if (!coinToRefund.getUsers().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 거래 내역만 환불할 수 있습니다.");
        }

        // 양수 금액인 '충전' 내역만 환불 가능
        if (coinToRefund.getCoinAmount() < 0) {
            throw new IllegalArgumentException("충전 내역만 환불할 수 있습니다.");
        }

        user.setPoint(user.getPoint() - coinToRefund.getCoinAmount());
        userRepository.saveUser(user);

        coinRepository.delete(coinToRefund);

        return CoinResponseDTO.success("환불 처리가 완료되었습니다.", user.getPoint());
    }

    private record CoinPackageInfo(Integer coinAmount, Integer paymentAmount) {}

    @Transactional
    public Coin useCoinForMatch(User user, Long amount) {
        user.setPoint(user.getPoint() - amount.intValue());
        userRepository.saveUser(user);

        Coin useCoin = new Coin();
        useCoin.setUsers(user);
        useCoin.setCoinAmount(-amount.intValue()); // 음수
        useCoin.setPaymentAmount(0);
        useCoin.setPaymentMethod("MATCH_PENDING");
        return coinRepository.save(useCoin);
    }

    @Transactional
    public Coin payoutToGamemate(User gamemateUser, Long amount) {
        gamemateUser.setPoint(gamemateUser.getPoint() + amount.intValue());
        userRepository.saveUser(gamemateUser);

        Coin payoutCoin = new Coin();
        payoutCoin.setUsers(gamemateUser);
        payoutCoin.setCoinAmount(amount.intValue()); // 양수
        payoutCoin.setPaymentAmount(0);
        payoutCoin.setPaymentMethod("GAMEMATE_PAYOUT");
        return coinRepository.save(payoutCoin);
    }

    @Transactional
    public Coin cancelMatchRefund(User requester, Long amount) {
        requester.setPoint(requester.getPoint() + amount.intValue());
        userRepository.saveUser(requester);

        Coin refundCoin = new Coin();
        refundCoin.setUsers(requester);
        refundCoin.setCoinAmount(amount.intValue()); // 양수
        refundCoin.setPaymentAmount(0);
        refundCoin.setPaymentMethod("MATCH_CANCELLED");
        return coinRepository.save(refundCoin);
    }
}
