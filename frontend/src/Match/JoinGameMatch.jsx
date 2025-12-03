import React, { useState } from "react";
import "../css/JoinGameMatch.css"; // CSS 파일 경로는 필요에 따라 수정하세요.
import { FaClock, FaGamepad } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiGamepad } from "react-icons/gi";
import PUBGIcon from "../assets/smallBattle.png";
import LOLIcon from "../assets/smallLOL.png";
import OverIcon from "../assets/smallOver.png";
import api from "../api/axios";

const availableGames = [
  { id: 0, name: "게임명 선택" },
  { id: 1, name: "리그 오브 레전드" },
  { id: 2, name: "배틀그라운드" },
  { id: 3, name: "오버워치 2" },
];

const availableTiers = [
  { value: "", name: "티어 선택" },
  { value: "BRONZE", name: "브론즈" },
  { value: "SILVER", name: "실버" },
  { value: "GOLD", name: "골드" },
  { value: "PLATINUM", name: "플래티넘" },
  { value: "DIAMOND", name: "다이아몬드" },
  { value: "MASTER", name: "마스터" },
  { value: "GRANDMASTER", name: "그랜드마스터" },
];

const GameTierSelect = ({ rate, onChange }) => {
  const isGameSelected = rate.name !== "게임명 선택";
  const title =
    rate.name === "게임명 선택"
      ? `게임 ${rate.id.slice(-1).toUpperCase()} 티어`
      : rate.name;

  const selectedTierName =
    availableTiers.find((t) => t.value === rate.tier)?.name ||
    availableTiers[0].name;

  return (
    <div className="tier-image-wrapper">
      <p className="tier-game-title">{title}</p>
      <select
        name={`tier-select-${rate.id}`}
        value={rate.tier}
        onChange={(e) => onChange(rate.id, "tier", e.target.value)}
        className={`tier-select-dropdown ${!isGameSelected ? "disabled" : ""}`}
        disabled={!isGameSelected}
      >
        {availableTiers.map((tier) => (
          <option key={tier.value} value={tier.value}>
            {tier.name}
          </option>
        ))}
      </select>
      <p className="selected-tier-display">
        {isGameSelected ? selectedTierName : "게임을 먼저 선택"}
      </p>
    </div>
  );
};

const GameRateInput = ({ rate, onChange, selectedNames }) => {
  const isGameSelected = rate.name !== "게임명 선택";
  return (
    <div className="rate-input-group-extended">
      <div className="rate-input-row">
        <label>게임 명:</label>
        <select
          name={`gameName-${rate.id}`}
          value={rate.name}
          onChange={(e) => onChange(rate.id, "name", e.target.value)}
          className="game-select"
        >
          {availableGames
            .filter(
              (game) =>
                game.name === rate.name ||
                game.id === 0 ||
                !selectedNames.includes(game.name)
            )
            .map((game) => (
              <option key={game.id} value={game.name}>
                {game.name}
              </option>
            ))}
        </select>

        <label className="rate-input-label">코인:</label>
        <div className="rate-input-group">
          <input
            type="number"
            value={rate.price}
            placeholder="코인"
            onChange={(e) => onChange(rate.id, "price", e.target.value)}
            disabled={!isGameSelected}
          />
        </div>
      </div>
    </div>
  );
};

const JoinGameMatch = () => {
  const [preferredGame, setPreferredGame] = useState("LOL");
  const [gameRates, setGameRates] = useState([
    { id: "rate-a", gameId: 0, name: "게임명 선택", tier: "", price: "" },
    { id: "rate-b", gameId: 0, name: "게임명 선택", tier: "", price: "" },
    { id: "rate-c", gameId: 0, name: "게임명 선택", tier: "", price: "" },
  ]);

  const [availableTime, setAvailableTime] = useState({
    game: "",
    time: "00:00",
  });

  const [introduction, setIntroduction] = useState("");

  const selectedNames = gameRates
    .map((g) => g.name)
    .filter((n) => n && n !== "게임명 선택");

  const handleRateChange = (id, field, value) => {
    setGameRates((prev) =>
      prev.map((rate) => {
        if (rate.id !== id) return rate;
        if (field === "name") {
          const found = availableGames.find((g) => g.name === value);
          return {
            ...rate,
            name: value,
            gameId: found?.id ?? rate.gameId,
            tier: "",
            price: "",
          };
        }
        return { ...rate, [field]: value };
      })
    );
  };

  const handleSubmit = async () => {
    const invalidRate = gameRates.find((g) => {
      const price = Number(g.price);
      return g.name !== "게임명 선택" && !isNaN(price) && price > 2000;
    });
    if (invalidRate) {
      alert("2000코인을 초과한 항목이 있습니다.");
      return;
    }

    const incompleteGameRate = gameRates.find(
      (g) => g.name !== "게임명 선택" && (!g.tier || !g.price)
    );
    if (incompleteGameRate) {
      alert(
        `${incompleteGameRate.name}에 대해 티어, 코인을 모두 설정해주세요.`
      );
      return;
    }

    const gamesData = gameRates
      .filter((g) => g.name !== "게임명 선택" && g.price && g.tier)
      .map((g) => ({
        gameId: g.gameId,
        tier: g.tier,
        price: Number(g.price),
      }));

    const jsonData = {
      games: gamesData,
      introduction,
      preferredGame,
      availableTime,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await api.post("/api/gamemates", jsonData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) alert("등록 완료되었습니다.");
      else {
        const errorText = await response.text();
        alert(
          `등록 실패: ${response.status} - ${errorText.substring(0, 100)}...`
        );
      }
    } catch (e) {
      alert(`네트워크 오류: ${e.message}`);
    }
  };

  return (
    <div className="join-game-match-container">
      <h1 className="page-header">게임 메이트 등록</h1>
      <div className="content-area">
        <div className="settings-section">
          {/* 게임별 코인, 시간 등록 */}
          <div className="setting-box">
            <h3 className="setting-header">
              <MdOutlineAttachMoney /> 게임별 코인, 시간 등록
            </h3>
            <div className="rate-inputs">
              {gameRates.map((rate) => (
                <GameRateInput
                  key={rate.id}
                  rate={rate}
                  onChange={handleRateChange}
                  selectedNames={selectedNames}
                />
              ))}
            </div>
          </div>
          {/* 선호 게임 설정 */}
          <div className="setting-game">
            <h3 className="setting-header">
              <GiGamepad /> 선호 게임 설정
            </h3>
            <div className="preference-games">
              <div
                className="game-option"
                onClick={() => setPreferredGame("PUBG")}
              >
                <img src={PUBGIcon} alt="PUBG" />
                <input
                  type="checkbox"
                  checked={preferredGame === "PUBG"}
                  readOnly
                />
              </div>
              <div
                className="game-option"
                onClick={() => setPreferredGame("OverWatch")}
              >
                <img src={OverIcon} alt="OverWatch" />
                <input
                  type="checkbox"
                  checked={preferredGame === "OverWatch"}
                  readOnly
                />
              </div>
              <div
                className="game-option"
                onClick={() => setPreferredGame("LOL")}
              >
                <img src={LOLIcon} alt="LOL" />
                <input
                  type="checkbox"
                  checked={preferredGame === "LOL"}
                  readOnly
                />
              </div>
            </div>
          </div>
          {/* 게임 별 티어 선택 */}
          <div className="setting-box tier-verification-box">
            <h3 className="setting-header">
              <FaGamepad /> 게임 별 티어 선택
            </h3>
            <div className="tier-images">
              {gameRates.map((rate) => (
                <GameTierSelect
                  key={rate.id}
                  rate={rate}
                  onChange={handleRateChange}
                />
              ))}
            </div>
          </div>

          {/* 👇 이 섹션이 가로로 배치됩니다. */}
          <div className="info-and-time-container">
            {/* 소개 섹션 */}
            <div className="section-group introduction">
              <label className="section-title">소개</label>
              <textarea
                className="intro-textarea"
                value={introduction}
                placeholder="소개를 적어주세요"
                onChange={(e) => setIntroduction(e.target.value)}
              />
            </div>
            {/* 이용가능 시간대 섹션 */}
            <div className="available-time">
              <div className="available-time-header">
                <FaClock className="clock-icon" />
                <label className="section-title">이용가능 시간대</label>
              </div>

              <div className="time-game-name-input-row">
                <p className="game-name-label">게임명:</p>
                <input
                  type="text"
                  value={availableTime.game}
                  onChange={(e) =>
                    setAvailableTime({ ...availableTime, game: e.target.value })
                  }
                />
              </div>

              <div className="time-input-group">
                <label>시간:</label>
                <input
                  type="time"
                  className="time-input"
                  value={availableTime.time}
                  onChange={(e) =>
                    setAvailableTime({ ...availableTime, time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          {/* 👆 가로 배치 섹션 끝 */}

          {/* 등록/취소 버튼 */}
          <div className="action-buttons">
            <button className="register-button" onClick={handleSubmit}>
              등록하기
            </button>
            <button className="cancel-button">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameMatch;
