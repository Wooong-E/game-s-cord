import React, { useEffect, useState } from "react";
import "./MatchDetail.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios";

import profileImage from "./assets/user1.png";
import pubg from "./assets/Battleground.jpg";
import lol from "./assets/LeaguofLeagends.jpg";
import overwatch from "./assets/Overwatch.jpg";

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
  const [newScore, setNewScore] = useState(5);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchMatchDetail = async () => {
      try {
        const res = await axios.get(`/gamemates/profile/${userId}`);
        setMatchData(res.data);

        if (res.data.games && res.data.games.length > 0) {
          const defaultGame = res.data.games[0];
          setSelectedGame(defaultGame);
          await fetchGameReviews(userId, defaultGame.gameId, setReviews);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMatchDetail();
  }, [userId, navigate]);

  useEffect(() => {
    if (selectedGame) {
      fetchGameReviews(userId, selectedGame.gameId, setReviews);
    }
  }, [userId, selectedGame]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleMatchRequest = async (game) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.post(
        "/matches",
        {
          orderedUsersId: userId,
          ordersGameId: selectedGame.gameId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("매치 신청이 완료되었습니다!");
    } catch (e) {
      console.error("매치 신청 오류:", e);
      alert("매치 신청에 실패했습니다.");
    }
  };

  const submitReview = async () => {
    if (!newReview.trim()) {
      alert("리뷰를 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `/gamemates/${userId}/${selectedGame.gameId}/reviews`,
        {
          score: newScore,
          review: newReview,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("리뷰가 등록되었습니다!");

      setNewReview("");
      setNewScore(5);

      fetchGameReviews(userId, selectedGame.gameId, setReviews);
    } catch (e) {
      console.error("리뷰 등록 실패:", e);
      alert("리뷰 등록에 실패했습니다 사유:", e);
    }
  };

  if (!matchData) return null;

  const displayRating =
    selectedGame?.averageScore || matchData.overallAverageScore;
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
        {selectedGame && (
          <div className="game-detail-panel">
            <h3>{selectedGame.name}</h3>
            <p>게임 유형: {selectedGame.gameType || "N/A"}</p>
            <p>가격: {selectedGame.price}원</p>
            <p>설명: {selectedGame.description || "등록된 설명이 없습니다."}</p>
            <button
              className="match-request-btn"
              onClick={() => handleMatchRequest(selectedGame)}
            >
              매치 신청하기
            </button>
          </div>
        )}

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
                  <span className="review-date">
                    {r.createdAt.substring(0, 10)}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-review">리뷰 없음</div>
            )}
          </div>

          <div className="review-form">
            <h4>리뷰 작성</h4>

            <div className="review-inputs">
              <div className="star-select-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${newScore >= star ? "filled" : ""}`}
                    onClick={() => setNewScore(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="리뷰를 입력하세요"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="review-textarea"
              />
              <button className="submit-review-btn" onClick={submitReview}>
                리뷰 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
