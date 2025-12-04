## Match Decline Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as MatchController
    participant Service as MatchService
    participant MatchRepo as MatchRepository
    participant GameMateRepo as GameMateRepository
    participant CoinService as CoinService
    participant NotificationSvc as NotificationService
    participant UserRepo as UserRepository
    participant CoinRepo as CoinRepository
    participant DB

    Client->>Controller: PATCH /api/matches/{matchId}/decline (userDetails)
    Controller->>Service: declineMatch(matchId, userDetails.getId())

    Service->>MatchRepo: findById(matchId)
    MatchRepo->>DB: SELECT * FROM matches WHERE orders_id=?
    DB-->>MatchRepo: Optional<Match>
    MatchRepo-->>Service: match

    alt If match not found
        Service->>Service: throw IllegalArgumentException("매칭 정보를 찾을 수 없습니다")
    end

    Service->>Service: Check if userId == match.orderedUsersId
    alt If not authorized
        Service->>Service: throw IllegalArgumentException("해당 매칭을 거절할 권한이 없습니다")
    end

    Service->>Service: Check if orderStatus == "PENDING"
    alt If not PENDING
        Service->>Service: throw IllegalStateException("대기 중인 매칭만 거절할 수 있습니다")
    end

    Service->>GameMateRepo: findGamemateByUsersId(orderedUsersId, ordersGameId)
    GameMateRepo->>DB: SELECT * FROM gamemates WHERE users_id=? AND games_id=?
    DB-->>GameMateRepo: Gamemate gamemate
    GameMateRepo-->>Service: gamemate

    alt If gamemate is null
        Service->>Service: throw IllegalStateException("게임메이트 정보를 찾을 수 없습니다")
    end

    Service->>UserRepo: findById(orderUsersId)
    UserRepo->>DB: SELECT * FROM users WHERE users_id=?
    DB-->>UserRepo: User requester
    UserRepo-->>Service: requester

    Service->>CoinService: cancelMatchRefund(requester, price)
    CoinService->>UserRepo: saveUser(requester) with updated point
    CoinService->>CoinRepo: save(refundCoin)
    CoinService-->>Service: Coin

    Service->>NotificationSvc: createNotification(orderUsersId, "MATCH_DECLINED", matchId, message)
    NotificationSvc->>DB: INSERT INTO notifications (...)

    Service->>MatchRepo: deleteMatch(match)
    MatchRepo->>DB: DELETE FROM matches WHERE orders_id=?
    DB-->>MatchRepo: Deleted

    Service->>Service: match.setOrderStatus("DECLINED")
    Service->>Service: MatchResponseDTO.of(match)
    Service-->>Controller: MatchResponseDTO
    Controller->>Client: 200 OK (MatchResponseDTO)
```

---

## 매칭 거절 (PATCH `/api/matches/{matchId}/decline`)

| 항목 | 흐름 요약 | 핵심 비즈니스 로직 |
|:---|:---|:---|
| **목표** | 게임메이트가 매칭 요청을 거절 | 코인 환불 및 매칭 삭제 |
| **요청 수신 및 인증** | `Client` 요청 수신 후, `Controller`는 `userDetails`를 통해 **사용자 ID를 추출**하여 `Service`로 전달합니다. | - |
| **매칭 조회** | `MatchService`는 `MatchRepository`를 통해 매칭 정보를 조회합니다. | **매칭 존재 확인** |
| **권한 확인** | 요청자가 **매칭을 받은 게임메이트 본인인지** 확인합니다. | **orderedUsersId == userId** |
| **상태 확인** | 매칭 상태가 **PENDING**인지 확인합니다. | **대기 중인 매칭만 거절 가능** |
| **게임메이트 조회** | `GameMateRepository`를 통해 게임메이트 정보와 가격을 조회합니다. | - |
| **요청자 조회** | `UserRepository`를 통해 원래 매칭 요청자를 조회합니다. | - |
| **코인 환불** | `CoinService.cancelMatchRefund()`를 통해 요청자에게 **코인을 환불**합니다. | **MATCH_CANCELLED 거래 생성** |
| **알림 생성** | 요청자에게 **매칭 거절 알림**을 생성합니다. | **MATCH_DECLINED 알림** |
| **매칭 삭제** | 거절 완료 후 **매칭 레코드를 DB에서 삭제**합니다. | **매칭 기록 삭제** |
| **응답 반환** | 거절된 매칭 정보를 DTO로 변환하여 **HTTP 200 OK** 응답과 함께 반환합니다. | - |
