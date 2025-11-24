package com.example.gamescord.service.gamemate;

import com.example.gamescord.domain.Game;
import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO;
import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.repository.game.GameRepository;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import com.example.gamescord.repository.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamemateService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameMateRepository gameMateRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public List<GamemateResponseDTO> registerGamemate(Long userId, GamemateRegistrationRequestDTO requestDto) {
        User user = userRepository.findById(userId);

        if (requestDto.getIntroduction() != null) {
            user.setUsersDescription(requestDto.getIntroduction());
            userRepository.saveUser(user);
        }

        if (requestDto.getGames() == null || requestDto.getGames().isEmpty()) {
            throw new IllegalArgumentException("등록할 게임 정보가 없습니다.");
        }

        List<Gamemate> newGamemates = new ArrayList<>();
        for (GamemateRegistrationRequestDTO.GameInfo gameInfo : requestDto.getGames()) {
            Game game = gameRepository.findGameById(gameInfo.getGameId());
            if (game == null) {
                throw new IllegalArgumentException("게임을 찾을 수 없습니다: ID " + gameInfo.getGameId());
            }

            if (gameMateRepository.findGamemateByUsersId(userId, gameInfo.getGameId()) != null) {
                throw new IllegalArgumentException("이미 ID " + gameInfo.getGameId() + " 게임의 게임메이트로 등록되어 있습니다.");
            }

            Gamemate newGamemate = new Gamemate();
            newGamemate.setUsers(user);
            newGamemate.setGames(game);
            newGamemate.setPrice(gameInfo.getPrice());
            newGamemate.setTier(gameInfo.getTier());

            gameMateRepository.saveGamemate(newGamemate);
            newGamemates.add(newGamemate);
        }

        return newGamemates.stream()
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GamemateResponseDTO> searchGamematesByUserName(String userName) {
        List<Gamemate> gamemates = gameMateRepository.findGamematesByUsersName(userName);
        return gamemates.stream()
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GamemateProfileResponseDTO getGamemateProfile(Long userId) {
        User user = userRepository.findById(userId);

        // 전체 평점 계산
        List<Integer> allScores = reviewRepository.findAllScoresByUserId(userId);
        double overallAverageScore = allScores.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        // 게임별 평점 계산
        List<Gamemate> gamemates = gameMateRepository.findGamematesByUsersId(userId);
        List<GamemateProfileResponseDTO.GameProfile> gameProfiles = gamemates.stream()
                .map(gamemate -> {
                    Double averageScore = reviewRepository.findAverageScoreByGamemateId(gamemate.getId());
                    return GamemateProfileResponseDTO.GameProfile.builder()
                            .gameId(gamemate.getGames().getId())
                            .gameName(gamemate.getGames().getGamesName())
                            .price(gamemate.getPrice())
                            .tier(gamemate.getTier())
                            .averageScore(formatScore(averageScore))
                            .build();
                })
                .collect(Collectors.toList());

        return GamemateProfileResponseDTO.builder()
                .userId(user.getId())
                .userName(user.getUsersName())
                .userDescription(user.getUsersDescription())
                .profileImageUrl(user.getProfileImageUrl())
                .overallAverageScore(formatScore(overallAverageScore))
                .games(gameProfiles)
                .build();
    }

    @Transactional
    public void deleteGamemate(Long userId, Long gameId) {
        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(userId, gameId);
        if (gamemate == null) {
            throw new IllegalArgumentException("해당 게임에 대한 게임메이트 등록 정보를 찾을 수 없습니다.");
        }
        gameMateRepository.deleteGamemate(gamemate);
    }

    @Transactional(readOnly = true)
    public List<GamemateResponseDTO> getPopularGamemates() {
        List<Long> popularGamemateIds = reviewRepository.findTop4ByReviewsCount();
        if (popularGamemateIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        List<Gamemate> popularGamemates = gameMateRepository.findAllByIds(popularGamemateIds);

        Map<Long, Gamemate> gamemateMap = popularGamemates.stream()
                .collect(Collectors.toMap(Gamemate::getId, java.util.function.Function.identity()));

        return popularGamemateIds.stream()
                .map(gamemateMap::get)
                .filter(Objects::nonNull)
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private double formatScore(Double score) {
        if (score == null) {
            return 0.0;
        }
        return Math.round(score * 100.0) / 100.0;
    }

    // 통합 필터링 및 정렬을 위한 서비스 메소드
    @Transactional(readOnly = true)
    public List<GamemateResponseDTO> searchGamematesByFilter(Long gameId, String gender, String tier, String sortBy) {
        List<Gamemate> gamemates = gameMateRepository.findWithFiltersAndSort(gameId, gender, tier, sortBy);
        return gamemates.stream()
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /*
    @Transactional(readOnly = true)
    public List<GamemateResponseDTO> searchGamematesByFilter(Long gameId, String gender, String tier) {
        boolean hasGender = gender != null && !gender.isEmpty() && !"모두".equals(gender);
        boolean hasTier = tier != null && !tier.isEmpty();

        List<Gamemate> gamemates;

        if (hasGender && hasTier) {
            gamemates = gameMateRepository.findByGenderAndTier(gender, tier, gameId);
        } else if (hasGender) {
            gamemates = gameMateRepository.findByGender(gender, gameId);
        } else if (hasTier) {
            gamemates = gameMateRepository.findByTier(tier, gameId);
        } else {
            gamemates = gameMateRepository.findByGameId(gameId);
        }

        return gamemates.stream()
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    */
}
