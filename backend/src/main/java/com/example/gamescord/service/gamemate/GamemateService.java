package com.example.gamescord.service.gamemate;

import com.example.gamescord.domain.Game;
import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.Profile;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO;
import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.dto.gamemate.GamemateUpdateRequestDTO;
import com.example.gamescord.repository.profile.ProfileRepository;

import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.repository.game.GameRepository;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import com.example.gamescord.repository.review.ReviewRepository;
import com.example.gamescord.security.JwtUtil;
import com.example.gamescord.service.refreshtoken.RefreshTokenService;
import com.example.gamescord.service.s3.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamemateService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameMateRepository gameMateRepository;
    private final ReviewRepository reviewRepository;
    private final ProfileRepository profileRepository;

    private S3Service s3Service;


    @Transactional
    public List<GamemateResponseDTO> registerGamemate(Long userId, GamemateRegistrationRequestDTO requestDto,
                                                      MultipartFile imageFile) throws IOException {
        User user = userRepository.findById(userId);

        if (requestDto.getIntroduction() != null) {
            user.setUsersDescription(requestDto.getIntroduction());
            userRepository.saveUser(user);
        }

        if (requestDto.getGames() == null || requestDto.getGames().isEmpty()) {
            throw new IllegalArgumentException("등록할 게임 정보가 없습니다.");
        }

        // [3] S3 이미지 업로드 로직
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // S3Service를 사용하여 파일 업로드
            imageUrl = s3Service.uploadFile(imageFile);
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
            newGamemate.setStart(gameInfo.getStart());
            newGamemate.setEnd(gameInfo.getEnd());
            if (imageUrl != null) {
                Profile newProfile = new Profile();
                newProfile.setImagesUrl(imageUrl);

                // 양방향 관계 설정 (Gamemate와 Profile 연결)
                newProfile.setGamemate(newGamemate); // @ManyToOne 관계 설정
                newGamemate.getProfiles().add(newProfile); // @OneToMany 관계 설정 (선택 사항)

                profileRepository.save(newProfile);
            }

            gameMateRepository.saveGamemate(newGamemate);
            newGamemates.add(newGamemate);
        }

        return newGamemates.stream()
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<GamemateResponseDTO> updateGamemate(Long userId, GamemateUpdateRequestDTO requestDto) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        // 1. 요청에 포함된 게임 ID들을 Set으로 변환합니다.
        Set<Long> requestedGameIds = requestDto.getGames().stream()
                .map(GamemateUpdateRequestDTO.GameInfo::getGameId)
                .collect(Collectors.toSet());

        // 2. 사용자의 현재 모든 게임메이트 등록 정보를 가져옵니다.
        List<Gamemate> existingGamemates = gameMateRepository.findGamematesByUsersId(userId);

        // 3. 요청에 포함되지 않은 기존 등록 정보를 삭제합니다.
        List<Gamemate> gamematesToDelete = existingGamemates.stream()
                .filter(existing -> !requestedGameIds.contains(existing.getGames().getId()))
                .collect(Collectors.toList());

        for (Gamemate toDelete : gamematesToDelete) {
            gameMateRepository.deleteGamemate(toDelete);
        }

        // 4. 요청에 포함된 정보를 기준으로 등록하거나 업데이트합니다.
        List<Gamemate> finalGamemates = new ArrayList<>();
        for (GamemateUpdateRequestDTO.GameInfo gameInfo : requestDto.getGames()) {
            Game game = gameRepository.findGameById(gameInfo.getGameId());
            if (game == null) {
                // 이 게임 ID가 유효하지 않으면 건너뛰거나 예외를 발생시킬 수 있습니다.
                continue;
            }

            // 기존 등록 정보가 있는지 확인하고, 없으면 새로 만듭니다.
            Gamemate gamemate = existingGamemates.stream()
                    .filter(existing -> existing.getGames().getId().equals(gameInfo.getGameId()))
                    .findFirst()
                    .orElse(new Gamemate());

            if (gamemate.getId() == null) { // 새 엔티티인 경우
                gamemate.setUsers(user);
                gamemate.setGames(game);
            }

            // 정보 업데이트
            gamemate.setPrice(gameInfo.getPrice());
            gamemate.setTier(gameInfo.getTier());
            gamemate.setStart(gameInfo.getStart());
            gamemate.setEnd(gameInfo.getEnd());

            gameMateRepository.saveGamemate(gamemate);
            finalGamemates.add(gamemate);
        }

        // 5. 최종 결과를 DTO로 변환하여 반환합니다.
        return finalGamemates.stream()
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

        // 전체 평점 및 리뷰 개수 계산
        List<Integer> allScores = reviewRepository.findAllScoresByUserId(userId);
        double overallAverageScore = allScores.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);
        int overallReviewCount = allScores.size();

        // 게임별 평점 및 리뷰 개수 계산
        List<Gamemate> gamemates = gameMateRepository.findGamematesByUsersId(userId);
        List<GamemateProfileResponseDTO.GameProfile> gameProfiles = gamemates.stream()
                .map(gamemate -> {
                    Double averageScore = reviewRepository.findAverageScoreByGamemateId(gamemate.getId());
                    Long reviewCountLong = reviewRepository.countByGamemateId(gamemate.getId());
                    int reviewCount = (reviewCountLong != null) ? reviewCountLong.intValue() : 0;

                    return GamemateProfileResponseDTO.GameProfile.builder()
                            .gameId(gamemate.getGames().getId())
                            .gameName(gamemate.getGames().getGamesName())
                            .price(gamemate.getPrice())
                            .tier(gamemate.getTier())
                            .start(gamemate.getStart().toString().substring(0,5))
                            .end(gamemate.getEnd().toString().substring(0,5))
                            .averageScore(formatScore(averageScore))
                            .reviewCount(reviewCount)
                            .build();
                })
                .collect(Collectors.toList());

        return GamemateProfileResponseDTO.builder()
                .userId(user.getId())
                .userName(user.getUsersName())
                .userDescription(user.getUsersDescription())
                .profileImageUrl(user.getProfileImageUrl())
                .overallAverageScore(formatScore(overallAverageScore))
                .overallReviewCount(overallReviewCount)
                .games(gameProfiles)
                .build();
    }

    @Transactional(readOnly = true)
    public Map<Long, Boolean> checkRegistrationStatus(Long userId) {
        // 1. 모든 게임 목록을 가져옵니다.
        List<Game> allGames = gameRepository.findAll();

        // 2. 현재 사용자가 등록한 모든 게임메이트 정보를 가져옵니다.
        List<Gamemate> userGamemates = gameMateRepository.findGamematesByUsersId(userId);

        // 3. 사용자가 등록한 게임 ID를 Set으로 만들어 빠른 조회를 지원합니다.
        Set<Long> registeredGameIds = userGamemates.stream()
                .map(gamemate -> gamemate.getGames().getId())
                .collect(Collectors.toSet());

        // 4. 결과를 담을 Map을 생성하고, 각 게임에 대해 등록 여부를 확인합니다.
        return allGames.stream()
                .collect(Collectors.toMap(
                        Game::getId,
                        game -> registeredGameIds.contains(game.getId())
                ));
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
    public List<GamemateResponseDTO> getPopularGamemates(Long gameId) {
        // gameId 유효성 검사
        if (gameId < 1 || gameId > 3) {
            throw new IllegalArgumentException("등록되지 않은 게임입니다.");
        }

        List<Long> popularGamemateIds = reviewRepository.findTop4ByGameIdAndReviewsCount(gameId);
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
}
