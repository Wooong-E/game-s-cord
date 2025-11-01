package com.example.gamescord.service.match;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.Match;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.match.MatchRequestDTO;
import com.example.gamescord.dto.match.MatchResponseDTO;
import com.example.gamescord.dto.match.MatchStatusUpdateByKeyDTO;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import com.example.gamescord.repository.match.MatchRepository;
import com.example.gamescord.service.coin.CoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final GameMateRepository gameMateRepository;
    private final CoinService coinService;

    @Transactional
    public MatchResponseDTO requestMatch(Long requesterId, MatchRequestDTO requestDto) {
        User requester = userRepository.findById(requesterId);

        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(requestDto.getOrderedUsersId(), requestDto.getOrdersGameId());
        if (gamemate == null) {
            throw new IllegalArgumentException("해당 유저는 이 게임의 게임메이트로 등록되어 있지 않습니다.");
        }

        User gamematePlayer = gamemate.getUsers();
        Long price = gamemate.getPrice();

        if (requester.getPoint() < price) {
            throw new IllegalArgumentException("코인이 부족합니다. 현재 보유 코인: " + requester.getPoint());
        }

        if (requester.getId().equals(gamematePlayer.getId())) {
            throw new IllegalArgumentException("자기 자신에게 매칭을 요청할 수 없습니다.");
        }

        // CoinService를 사용하여 코인 차감 및 내역 기록
        coinService.useCoinForMatch(requester, price);

        Match newMatch = new Match();
        newMatch.setUsers(requester);
        newMatch.setOrderUsersId(requester.getId());
        newMatch.setOrderedUsersId(gamematePlayer.getId());
        newMatch.setOrdersGameId(requestDto.getOrdersGameId());
        newMatch.setOrderStatus("PENDING");

        matchRepository.saveMatch(newMatch);

        return MatchResponseDTO.of(newMatch);
    }

    @Transactional
    public MatchResponseDTO updateMatchStatus(MatchStatusUpdateByKeyDTO requestDto, Long currentUserId) {
        if (!currentUserId.equals(requestDto.getOrderedUsersId())) {
            throw new IllegalArgumentException("매칭 상태를 변경할 권한이 없습니다.");
        }

        Match match = matchRepository.findMatch(
                requestDto.getOrderUsersId(),
                requestDto.getOrderUsersId(),
                requestDto.getOrderedUsersId(),
                requestDto.getOrdersGameId()
        );

        if (match == null) {
            throw new IllegalArgumentException("해당 조건의 매칭 정보를 찾을 수 없습니다.");
        }

        if (!"PENDING".equals(match.getOrderStatus())) {
            throw new IllegalStateException("대기 중인 매칭만 상태를 변경할 수 있습니다.");
        }

        String newStatus = requestDto.getOrderStatus().toUpperCase();
        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(match.getOrderedUsersId(), match.getOrdersGameId());
        if (gamemate == null) {
            throw new IllegalStateException("게임메이트 정보를 찾을 수 없습니다.");
        }
        Long price = gamemate.getPrice();

        if ("ACCEPTED".equals(newStatus)) {
            match.setOrderStatus("ACCEPTED");
            User gamemateUser = gamemate.getUsers();
            // CoinService를 사용하여 게임메이트에게 코인 지급
            coinService.payoutToGamemate(gamemateUser, price);
            matchRepository.saveMatch(match);

        } else if ("DECLINED".equals(newStatus)) {
            User requester = userRepository.findById(match.getOrderUsersId());
            // CoinService를 사용하여 요청자에게 코인 환불
            coinService.cancelMatchRefund(requester, price);
            // 매치 기록 삭제
            matchRepository.deleteMatch(match);
        } else {
            throw new IllegalArgumentException("잘못된 상태 값입니다: " + newStatus);
        }

        return MatchResponseDTO.of(match);
    }

    @Transactional
    public MatchResponseDTO cancelMatchByUser(Long matchId, Long requesterId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("매칭 정보를 찾을 수 없습니다."));

        if (!match.getOrderUsersId().equals(requesterId)) {
            throw new IllegalArgumentException("본인이 요청한 매칭만 취소할 수 있습니다.");
        }

        if (!"PENDING".equals(match.getOrderStatus())) {
            throw new IllegalStateException("대기 중인 매칭만 취소할 수 있습니다.");
        }

        User requester = userRepository.findById(requesterId);

        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(match.getOrderedUsersId(), match.getOrdersGameId());
        if (gamemate == null) {
            throw new IllegalStateException("게임메이트 정보를 찾을 수 없습니다.");
        }
        Long price = gamemate.getPrice();

        // DTO를 먼저 생성
        MatchResponseDTO responseDto = MatchResponseDTO.of(match);
        responseDto.setOrderStatus("CANCELLED");

        // CoinService를 사용하여 요청자에게 코인 환불
        coinService.cancelMatchRefund(requester, price);

        // 매치 기록 삭제
        matchRepository.deleteMatch(match);

        return responseDto;
    }

}
