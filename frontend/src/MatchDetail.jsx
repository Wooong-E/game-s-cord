import React, { useState } from "react";
import "./MatchDetail.css";
import profileImage from "./assets/user1.png";

const MatchDetail = () => {
  // 클릭된 게임 상태 관리
  const [selectedGame, setSelectedGame] = useState(null);

  // 더미 데이터
  const matchData = {
    profileImageUrl: profileImage,
    username: "USER1",
    bio: "안녕하세요.",
    games: [
      {
        name: "배틀그라운드",
        iconUrl: "https://via.placeholder.com/40",
        price: 999,
        rating: 4.97,
        reviewCount: 100,
        imageUrl: "https://via.placeholder.com/150/0000FF/808080?text=Battlegrounds", // 게임 이미지
      },
      {
        name: "전략적 팀 전투",
        iconUrl: "https://via.placeholder.com/40",
        price: 999,
        rating: 4.5,
        reviewCount: 200,
        imageUrl: "https://via.placeholder.com/150/FF5733/FFFFFF?text=TeamFight",
      },
      {
        name: "리그오브레전드",
        iconUrl: "https://via.placeholder.com/40",
        price: 999,
        rating: 4.3,
        reviewCount: 300,
        imageUrl: "https://via.placeholder.com/150/33FF57/FFFFFF?text=LeagueOfLegends",
      },
    ],
    reviews: [
      { content: "안녕하세요", date: "8-21 18:00" },
      { content: "안녕히계세요", date: "8-21 13:40" },
    ],
    rating: 4.97,
    reviewCount: 100,
  };

  // 게임 클릭 시 동작
  const handleGameClick = (game) => {
    setSelectedGame(game); // 클릭한 게임 정보를 상태에 저장
  };

  return (
    <div className="match-detail-page">
      {/* 좌측 프로필 섹션 */}
      <div className="left-panel">
        <img
          src={matchData.profileImageUrl}
          alt="profile"
          className="profile-img"
        />
        <div className="username">{matchData.username}</div>
        <div className="bio-text">{matchData.bio}</div>
      </div>

      {/* 우측 게임 정보 및 리뷰 */}
      <div className="right-panel">
        <div className="game-list">
          {matchData.games.map((game) => (
            <button
              className="game-item"
              key={game.name}
              type="button"
              onClick={() => handleGameClick(game)}  // 게임 클릭 시 동작
            >
              <img src={game.iconUrl} alt={game.name} className="game-icon" />
              <div className="game-detail">
                <span className="game-name">{game.name}</span>
                <span className="game-price">{game.price}원</span>
              </div>
            </button>
          ))}
        </div>

        {/* 선택된 게임 정보가 있는 경우 아래에 표시 */}
        {selectedGame && (
          <div className="selected-game-info">
            <img src={selectedGame.imageUrl} alt={selectedGame.name} className="selected-game-img" />
            <div className="selected-game-details">
              <h2>{selectedGame.name}</h2>
              <div className="game-rating">
                <span>★ {selectedGame.rating}</span> | <span>{selectedGame.reviewCount}건</span>
              </div>
              <button className="apply-button">의뢰하기</button>
            </div>
          </div>
        )}

        {/* 리뷰 목록 섹션 (항상 표시) */}
        <div className="review-panel">
          <div className="review-title">
            리뷰 <br></br>
            <span className="star-rating">★</span>
            <span className="rating-number">{matchData.rating}</span> (
            {matchData.reviewCount}건)
          </div>

          <div className="review-list">
            {matchData.reviews.length > 0 ? (
              matchData.reviews.map((r, idx) => (
                <div className="review-item" key={idx}>
                  <p className="review-content">{r.content}</p>
                  <span className="review-date">{r.date}</span>
                </div>
              ))
            ) : (
              <div className="no-review">리뷰 없음</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
