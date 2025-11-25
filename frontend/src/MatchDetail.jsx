import React, { useEffect, useState } from "react";
import "./MatchDetail.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import profileImage from "./assets/user1.png";
import pubg from "./assets/Battleground.jpg";
import lol from "./assets/LeaguofLeagends.jpg";
import overwatch from "./assets/Overwatch.jpg";

// 특정 게임의 리뷰 데이터를 비동기로 불러오는 함수
const fetchGameReviews = async (userId, gameId, setReviews) => {
  if (!userId || !gameId) return;
  try {
    const res = await axios.get(`/api/gamemates/${userId}/${gameId}/reviews`);
    setReviews(res.data);
  } catch (e) {
    console.error("리뷰 조회 실패:", e);
    setReviews([]);
  }
};

const MatchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  const [matchData, setMatchData] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchMatchDetail = async () => {
      try {
        const res = await axios.get(`/api/gamemates/profile/${userId}`);
        setMatchData(res.data);

        if (res.data.games && res.data.games.length > 0) {
          const defaultGame = res.data.games[0];
          setSelectedGame(defaultGame);
          // 초기 게임 선택 후 바로 리뷰 로드
          await fetchGameReviews(userId, defaultGame.gameId, setReviews); 
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMatchDetail();
  }, [userId, navigate]);

  useEffect(() => {
    // selectedGame이 변경될 때마다 리뷰 다시 불러오기
    if (selectedGame) {
      fetchGameReviews(userId, selectedGame.gameId, setReviews);
    }
  }, [userId, selectedGame]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  if (!matchData) return null;

  // 리뷰 패널에 표시할 평점 및 리뷰 수 결정 (선택된 게임 > 전체)
  const displayRating = selectedGame?.averageScore || matchData.overallAverageScore;
  const displayReviewCount = selectedGame?.reviewCount || matchData.reviewCount;
  
  return (
    <div className="match-detail-page">
      <div className="left-panel">
        <img
          src={matchData.profileImageUrl || profileImage}
          alt="profile"
          className="profile-img"
        />
        <div className="username">{matchData.userName}</div>
        <div className="bio-text">{matchData.userDescription}</div>
      </div>

      <div className="right-panel">
        <div className="game-list">
          {matchData.games?.map((game) => {
            if (!game) return null; 

            return (
              <button
                className="game-item"
                key={game.gameId || game.name}
                type="button"
                onClick={() => handleGameClick(game)}
              >
                <img
                  src={
                    game.iconUrl ||
                    (game.name?.includes("배틀")
                      ? pubg
                      : game.name?.includes("리그")
                      ? lol
                      : overwatch)
                  }
                  alt={game.name}
                  className="game-icon"
                />
                <div className="game-detail">
                  <span className="game-name">{game.name}</span>
                  <span className="game-price">{game.price}원</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="review-panel">
          <div className="review-title">
            리뷰 <br />
            <span className="star-rating">★</span>
            <span className="rating-number">{displayRating}</span> (
            {displayReviewCount}건)
          </div>

          <div className="review-list">
            {reviews?.length > 0 ? (
              reviews.map((r, idx) => (
                <div className="review-item" key={r.reviewId || idx}>
                  <p className="review-content">{r.review}</p>
                  <span className="review-date">{r.createdAt.substring(0, 10)}</span>
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