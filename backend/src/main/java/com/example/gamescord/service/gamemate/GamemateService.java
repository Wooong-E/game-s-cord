package com.example.gamescord.service.gamemate;

import com.example.gamescord.domain.Game;
import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.dto.gamemate.SingleGamemateProfileResponseDTO;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO;
import com.example.gamescord.dto.gamemate.GamemateProfileResponseDTO.GameWithPrice;
import com.example.gamescord.repository.game.GameRepository;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamemateService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameMateRepository gameMateRepository;

    @Transactional
    public List<GamemateResponseDTO> registerGamemate(Long userId, GamemateRegistrationRequestDTO requestDto) {
        User user = userRepository.findById(userId);

        // Update user introduction
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

        List<Gamemate> gamemates = gameMateRepository.findGamematesByUsersId(userId);

        List<GameWithPrice> gamesWithPrices = gamemates.stream()
                .map(gamemateEntry -> GameWithPrice.builder()
                        .gameId(gamemateEntry.getGames().getId())
                        .gameName(gamemateEntry.getGames().getGamesName())
                        .price(gamemateEntry.getPrice())
                        .build())
                .collect(Collectors.toList());

        return GamemateProfileResponseDTO.builder()
                .userId(user.getId())
                .userName(user.getUsersName())
                .userDescription(user.getUsersDescription())
                .profileImageUrl(user.getProfileImageUrl())
                .games(gamesWithPrices)
                .build();
    }
}
