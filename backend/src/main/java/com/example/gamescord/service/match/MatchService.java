package com.example.gamescord.service.match;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.Match;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.match.MatchRequestDTO;
import com.example.gamescord.dto.match.MatchResponseDTO;
import com.example.gamescord.dto.match.MatchStatusUpdateByKeyDTO;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import com.example.gamescord.repository.match.MatchRepository;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.service.coin.CoinService;
import com.example.gamescord.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final GameMateRepository gameMateRepository;
    private final CoinService coinService;
    private final NotificationService notificationService;

    @Transactional
    public MatchResponseDTO requestMatch(Long requesterId, MatchRequestDTO requestDto) {
        User requester = userRepository.findById(requesterId);

        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(requestDto.getOrderedUsersId(), requestDto.getOrdersGameId());
        if (gamemate == null) {
            throw new IllegalArgumentException("해당 유저는 이 게임의 게임메이트로 등록되어 있지 않습니다.");
        }

        User gamematePlayer = gamemate.getUsers();
        Long price = gamemate.getPrice();

        // 중복 매칭 요청 확인
        Match existingMatch = matchRepository.findPendingMatch(requester.getId(), requester.getId(), gamematePlayer.getId(), requestDto.getOrdersGameId());
        if (existingMatch != null) {
            throw new IllegalArgumentException("이미 해당 게임메이트에게 보낸 매칭 요청이 있습니다.");
        }

        if (requester.getPoint() < price) {
            throw new IllegalArgumentException("코인이 부족합니다. 현재 보유 코인: " + requester.getPoint());
        }

        if (requester.getId().equals(gamematePlayer.getId())) {
            throw new IllegalArgumentException("자기 자신에게 매칭을 요청할 수 없습니다.");
        }

        coinService.useCoinForMatch(requester, price);

        Match newMatch = new Match();
        newMatch.setUsers(requester);
        newMatch.setOrderUsersId(requester.getId());
        newMatch.setOrderedUsersId(gamematePlayer.getId());
        newMatch.setOrdersGameId(requestDto.getOrdersGameId());
        newMatch.setOrderStatus("PENDING");

        matchRepository.saveMatch(newMatch);

        // 게임메이트에게 매칭 요청 알람 생성
        String message = String.format("%s님이 매칭을 요청했습니다.", requester.getUsersName());
        notificationService.createNotification(
                gamematePlayer.getId(),
                "MATCH_REQUEST",
                newMatch.getId(),
                message
        );

        return MatchResponseDTO.of(newMatch);
    }

    // 내가 보낸 매칭 요청 목록 조회
    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getSentMatches(Long userId) {
        List<Match> matches = matchRepository.findByOrderUsersId(userId);
        return matches.stream()
                .map(MatchResponseDTO::of)
                .collect(Collectors.toList());
    }


    // 매칭 요청 목록 조회
    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getReceivedMatches(Long userId) {
        List<Match> matches = matchRepository.findByOrderedUsersId(userId);
        return matches.stream()
                .map(MatchResponseDTO::of)
                .collect(Collectors.toList());
    }

    // 매칭 수락
    @Transactional
    public MatchResponseDTO acceptMatch(Long matchId, Long userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("매칭 정보를 찾을 수 없습니다."));

        // 권한 체크: 요청받은 사람만 수락 가능
        if (!match.getOrderedUsersId().equals(userId)) {
            throw new IllegalArgumentException("해당 매칭을 수락할 권한이 없습니다.");
        }

        if (!"PENDING".equals(match.getOrderStatus())) {
            throw new IllegalStateException("대기 중인 매칭만 수락할 수 있습니다.");
        }

        // 게임메이트 정보 조회
        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(match.getOrderedUsersId(), match.getOrdersGameId());
        if (gamemate == null) {
            throw new IllegalStateException("게임메이트 정보를 찾을 수 없습니다.");
        }

        Long price = gamemate.getPrice();
        User gamemateUser = gamemate.getUsers();

        // 상태 변경 및 코인 지급
        match.setOrderStatus("ACCEPTED");
        coinService.payoutToGamemate(gamemateUser, price);
        matchRepository.saveMatch(match);

        // 요청자에게 수락 알람 생성
        String acceptMessage = String.format("%s님이 매칭을 수락했습니다.", gamemateUser.getUsersName());
        notificationService.createNotification(
                match.getOrderUsersId(),
                "MATCH_ACCEPTED",
                match.getId(),
                acceptMessage
        );

        return MatchResponseDTO.of(match);
    }

    // 매칭 거절
    @Transactional
    public MatchResponseDTO declineMatch(Long matchId, Long userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("매칭 정보를 찾을 수 없습니다."));

        if (!match.getOrderedUsersId().equals(userId)) {
            throw new IllegalArgumentException("해당 매칭을 거절할 권한이 없습니다.");
        }

        if (!"PENDING".equals(match.getOrderStatus())) {
            throw new IllegalStateException("대기 중인 매칭만 거절할 수 있습니다.");
        }

        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(match.getOrderedUsersId(), match.getOrdersGameId());
        if (gamemate == null) {
            throw new IllegalStateException("게임메이트 정보를 찾을 수 없습니다.");
        }

        Long price = gamemate.getPrice();
        User requester = userRepository.findById(match.getOrderUsersId());
        User gamemateUser = gamemate.getUsers();

        coinService.cancelMatchRefund(requester, price);

        String declineMessage = String.format("%s님이 매칭을 거절했습니다.", gamemateUser.getUsersName());
        notificationService.createNotification(
                match.getOrderUsersId(),
                "MATCH_DECLINED",
                match.getId(),
                declineMessage
        );

        // 매칭 삭제
        matchRepository.deleteMatch(match);
        match.setOrderStatus("DECLINED");

        return MatchResponseDTO.of(match);
    }

    @Transactional
    public MatchResponseDTO updateMatchStatus(MatchStatusUpdateByKeyDTO requestDto, Long currentUserId) {
        if (!currentUserId.equals(requestDto.getOrderedUsersId())) {
            throw new IllegalArgumentException("매칭 상태를 변경할 권한이 없습니다.");
        }

        Match match = matchRepository.findPendingMatch(
                requestDto.getOrderUsersId(),
                requestDto.getOrderUsersId(),
                requestDto.getOrderedUsersId(),
                requestDto.getOrdersGameId()
        );

        if (match == null) {
            throw new IllegalArgumentException("해당 조건의 대기 중인 매칭 정보를 찾을 수 없습니다.");
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
            coinService.payoutToGamemate(gamemateUser, price);
            matchRepository.saveMatch(match);

            // 요청자에게 매칭 수락 알람 생성
            String acceptMessage = String.format("%s님이 매칭을 수락했습니다.", gamemateUser.getUsersName());
            notificationService.createNotification(
                    match.getOrderUsersId(),
                    "MATCH_ACCEPTED",
                    match.getId(),
                    acceptMessage
            );

        } else if ("DECLINED".equals(newStatus)) {
            User requester = userRepository.findById(match.getOrderUsersId());
            User gamemateUser = gamemate.getUsers();
            coinService.cancelMatchRefund(requester, price);

            // 요청자에게 매칭 거절 알람 생성
            String declineMessage = String.format("%s님이 매칭을 거절했습니다.", gamemateUser.getUsersName());
            notificationService.createNotification(
                    match.getOrderUsersId(),
                    "MATCH_DECLINED",
                    match.getId(),
                    declineMessage
            );

            matchRepository.deleteMatch(match);
            match.setOrderStatus("DECLINED"); // 응답 DTO를 위해 상태 설정
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

        MatchResponseDTO responseDto = MatchResponseDTO.of(match);
        responseDto.setOrderStatus("CANCELLED");

        coinService.cancelMatchRefund(requester, price);

        matchRepository.deleteMatch(match);

        return responseDto;
    }
}