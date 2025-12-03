import React, { useEffect, useState } from "react";
import "./MatchDetail.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page/MyPage/MarkPage.module.css"

import profileImage from "./assets/user1.png";
import pubg from "./assets/Battleground.jpg";
import lol from "./assets/LeaguofLeagends.jpg";
import overwatch from "./assets/Overwatch.jpg";
import coin from "./assets/coin.jpg"


const fetchGameReviews = async (userId, gameId, setReviews) => {
  if (!userId || !gameId) return;
  try {
    const res = await api.get(`/gamemates/${userId}/${gameId}/reviews`);
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
  const [isMarked, setIsMarked] = useState(false);


  const checkMarkedStatus = async () => {
    try {
      const res = await api.get("/marks");
      const marks = res.data;

      const exists = marks.some((m) => String(m.markedUserId) === String(userId));
      setIsMarked(exists);
    } catch (e) {
      console.error("즐겨찾기 조회 오류:", e);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchMatchDetail = async () => {
      try {
        const res = await api.get(`/gamemates/profile/${userId}`);
        setMatchData(res.data);

        if (res.data.games && res.data.games.length > 0) {
          const defaultGame = res.data.games[0];
          setSelectedGame(defaultGame);
          await fetchGameReviews(userId, defaultGame.gameId, setReviews);
        }

        await checkMarkedStatus();
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

  const toggleMark = async () => {
    try {
      if (isMarked) {
        await api.delete(`/marks/${userId}`);
        setIsMarked(false);
        alert("즐겨찾기가 해제되었습니다.");
      } else {
        await api.post(`/marks/${userId}`);
        setIsMarked(true);
        alert("즐겨찾기에 추가되었습니다.");
      }
    } catch (e) {
      console.error("즐겨찾기 처리 실패:", e);
      alert("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleMatchRequest = async () => {
    try {
      await api.post("/matches", {
        orderedUsersId: userId,
        ordersGameId: selectedGame.gameId,
      });

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
      await api.post(`/gamemates/${userId}/${selectedGame.gameId}/reviews`, {
        score: newScore,
        review: newReview,
      });

      alert("리뷰가 등록되었습니다!");

      setNewReview("");
      setNewScore(5);

      fetchGameReviews(userId, selectedGame.gameId, setReviews);
    } catch (e) {
      console.error("리뷰 등록 실패:", e);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  if (!matchData) return null;

  const displayRating =
    selectedGame?.averageScore || matchData.overallAverageScore;

  const displayReviewCount =
    selectedGame?.reviewCount || matchData.reviewCount;

  return (
    <div className="match-detail-page">

      <div className="left-panel">
        <img
          src={matchData.profileImageUrl && matchData.profileImageUrl !== "string" 
            ? matchData.profileImageUrl 
            : profileImage}
          alt="profile"
          className="profile-img"
        />

        <div className="username">{matchData.userName}</div>
        <div className="bio-text">{matchData.userDescription}</div>


        <FontAwesomeIcon 
              icon={faStar} 
              className={isMarked ? styles.activeStar : styles.star}
              onClick={toggleMark}
              />
      </div>


      <div className="right-panel">
        <div className="game-list">
          {matchData.games?.map((game) => {
            if (!game) return null;

            return (
              <button
                className="game-item"
                key={game.gameId}
                type="button"
                onClick={() => handleGameClick(game)}
              >
                <img
                  src={
                    game.iconUrl ||
                    (game.gameName?.includes("Battle")
                      ? pubg
                      : game.gameName?.includes("League")
                      ? lol
                      : overwatch)
                  }
                  alt={game.name}
                  className="game-icon"
                />

                <div className="game-detail">
                  <span className="game-name">{game.gameName}</span>
                  <span className="game-price">{game.price}원</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedGame && (
          <div className="game-detail-panel">
            <p className="game-detail-name">{selectedGame.gameName || "N/A"}</p>
            <p>
              <img src={coin} className="game-detail-coin"></img>
              {selectedGame.price}/판</p>
            <p>티어: {selectedGame.tier || "등록된 설명이 없습니다."}</p>
            <p>시간: {selectedGame.start}~{selectedGame.end}</p>

            <button className="match-request-btn" onClick={handleMatchRequest}>
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
