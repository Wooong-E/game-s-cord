import React, { useEffect, useState } from "react";
import "./MatchDetail.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import profileImage from "./assets/user1.png";
import pubg from "./assets/Battleground.jpg";
import lol from "./assets/LeaguofLeagends.jpg";
import overwatch from "./assets/Overwatch.jpg";

const MatchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  const [matchData, setMatchData] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchMatchDetail = async () => {
      try {
        const res = await axios.get(`/api/gamemates/${userId}`);
        setMatchData(res.data);

        if (res.data.games && res.data.games.length > 0) {
          setSelectedGame(res.data.games[0]);
        }
      } catch (e) {
        console.error( e);
      }
    };

    fetchMatchDetail();
  }, [userId, navigate]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  if (!matchData) return null;

  return (
    <div className="match-detail-page">
      <div className="left-panel">
        <img
          src={matchData.profileImageUrl || profileImage}
          alt="profile"
          className="profile-img"
        />
        <div className="username">{matchData.username}</div>
        <div className="bio-text">{matchData.bio}</div>
      </div>

      <div className="right-panel">
        <div className="game-list">
          {matchData.games?.map((game) => (
            <button
              className="game-item"
              key={game.name}
              type="button"
              onClick={() => handleGameClick(game)}
            >
              <img
                src={
                  game.iconUrl ||
                  (game.name.includes("배틀")
                    ? pubg
                    : game.name.includes("리그")
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
          ))}
        </div>

        {selectedGame && (
          <div className="selected-game-info">
            <img
              src={selectedGame.imageUrl || selectedGame.iconUrl}
              alt={selectedGame.name}
              className="selected-game-img"
            />
            <div className="selected-game-details">
              <h2>{selectedGame.name}</h2>
              <div className="game-rating">
                <span>★ {selectedGame.rating}</span> |{" "}
                <span>{selectedGame.reviewCount}건</span>
              </div>
              <button className="apply-button">의뢰하기</button>
            </div>
          </div>
        )}

        <div className="review-panel">
          <div className="review-title">
            리뷰 <br />
            <span className="star-rating">★</span>
            <span className="rating-number">{matchData.rating}</span> (
            {matchData.reviewCount}건)
          </div>

          <div className="review-list">
            {matchData.reviews?.length > 0 ? (
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
