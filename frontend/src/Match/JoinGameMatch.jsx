import React, { useState } from "react";
import "../css/JoinGameMatch.css";
import { FaPlus, FaClock, FaGamepad } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiGamepad } from "react-icons/gi";
import PUBGIcon from "../assets/smallBattle.png";
import LOLIcon from "../assets/smallLOL.png";
import OverIcon from "../assets/smallOver.png";

// 게임 목록
const availableGames = [
  { id: 0, name: "게임명 선택" },
  { id: 1, name: "리그 오브 레전드" },
  { id: 2, name: "배틀그라운드" },
  { id: 3, name: "오버워치 2" },
];

// 게임별 요금 입력 필드 컴포넌트
const GameRateInput = ({ rate, onChange, selectedNames }) => (
  <div className="rate-input-row">
    <label>게임 명:</label>
    <select
      name={`gameName-${rate.id}`} // 고유 ID 사용
      value={rate.name}
      onChange={(e) => onChange(rate.id, "name", e.target.value)} // 고유 ID 전달
      className="game-select"
    >
      {availableGames
        .filter(
          (game) =>
            // 1. 현재 선택된 게임명은 표시
            game.name === rate.name ||
            // 2. '게임명 선택' 옵션은 항상 표시 (중복 허용)
            game.id === 0 ||
            // 3. 아직 선택되지 않은 다른 게임들만 표시 (중복 방지)
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
        onChange={(e) => onChange(rate.id, "price", e.target.value)} // 고유 ID 전달
      />
    </div>
  </div>
);

const JoinGameMatch = () => {
  const [profileImages, setProfileImages] = useState(Array(5).fill(null));
  const [preferredGame, setPreferredGame] = useState("LOL");
  const [gameRates, setGameRates] = useState([
    {
      id: "rate-a", // 불변의 고유 ID
      gameId: 0, // 게임 자체 ID (0 = 게임명 선택)
      name: "게임명 선택",
      tier: "",
      price: "",
      time: "",
      gender: "",
    },
    {
      id: "rate-b",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      time: "",
      gender: "",
    },
    {
      id: "rate-c",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      time: "",
      gender: "",
    },
  ]);

  // 선택된 게임명 목록 (중복 방지용)
  // '게임명 선택'은 중복되어도 괜찮으므로 필터링에서 제외
  const selectedNames = gameRates
    .map((g) => g.name)
    .filter((n) => n && n !== "게임명 선택");

  const handleRateChange = (id, field, value) => {
    setGameRates((prev) =>
      prev.map((rate) => {
        if (rate.id !== id) return rate; // 고유 ID로 항목 식별

        // 게임명을 바꾸면 gameId도 함께 변경 (데이터 전송용)
        if (field === "name") {
          const found = availableGames.find((g) => g.name === value);
          // gameId도 변경하되, 고유 ID(rate.id)는 그대로 유지
          return { ...rate, name: value, gameId: found?.id ?? rate.gameId };
        }

        return { ...rate, [field]: value };
      })
    );
  };

  const [availableTime, setAvailableTime] = useState({
    game: "",
    time: "--:00",
  });

  const [tierImages, setTierImages] = useState([null, null, null]);
  const [introduction, setIntroduction] = useState("");

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...profileImages];
      newImages[index] = URL.createObjectURL(file);
      setProfileImages(newImages);
    }
  };

  const handleTierImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newTierImages = [...tierImages];
      newTierImages[index] = URL.createObjectURL(file);
      setTierImages(newTierImages);
    }
  };

  const handleSubmit = async () => {
    // 유효성 검사: 2000 코인 초과 여부 확인
    const isOverLimit = gameRates.some((g) => {
      const price = Number(g.price);
      // '게임명 선택'이 아니면서, 유효한 숫자이고, 2000을 초과하는 경우
      return g.name !== "게임명 선택" && !isNaN(price) && price > 2000;
    });

    if (isOverLimit) {
      alert(
        "등록하려는 게임 코인 중 2000코인을 초과하는 항목이 있습니다. 코인을 2000이하로 설정해주세요."
      );
      return; // 전송을 중단
    }

    // 2. 서버 전송 데이터 준비
    const gamesData = gameRates
      .filter((g) => g.name !== "게임명 선택" && g.price)
      .map((g) => ({
        gameId: g.gameId,
        tier: g.tier,
        price: g.price,
        time: g.time,
        gender: g.gender,
      }));

    const requestBody = {
      games: gamesData,
      introduction,
      preferredGame,
      availableTime,
    };

    console.log("전송 데이터:", requestBody);

    // 3. 서버 전송
    try {
      const response = await fetch("/api/gamemates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("게임 메이트 등록이 완료되었습니다.");
      } else {
        alert("등록 실패");
      }
    } catch {
      alert("네트워크 오류 발생");
    }
  };

  return (
    <div className="join-game-match-container">
      <h1 className="page-header">게임 메이트 등록</h1>

      <div className="content-area">
        {/* 왼쪽 영역 */}
        <div className="profile-section">
          <div className="profile-main-box">
            {profileImages[0] ? (
              <img
                src={profileImages[0]}
                className="profile-image"
                alt="메인 프로필 이미지"
              />
            ) : (
              <FaPlus className="plus-icon-lg" />
            )}
            <input
              type="file"
              id="main-image-upload"
              className="hidden-file-input"
              onChange={(e) => handleImageChange(0, e)}
            />
            <label
              htmlFor="main-image-upload"
              className="image-overlay"
            ></label>
          </div>

          <div className="profile-sub-buttons">
            {profileImages.slice(1).map((img, index) => (
              <div key={index + 1} className="sub-image-wrapper">
                {img ? (
                  <img
                    src={img}
                    className="profile-image-sm"
                    alt={`서브 프로필 이미지 ${index + 1}`}
                  />
                ) : (
                  <FaPlus className="plus-icon-sm" />
                )}
                <input
                  type="file"
                  id={`sub-image-upload-${index + 1}`}
                  className="hidden-file-input"
                  onChange={(e) => handleImageChange(index + 1, e)}
                />
                <label
                  htmlFor={`sub-image-upload-${index + 1}`}
                  className="sub-image-label"
                ></label>
              </div>
            ))}
          </div>

          <div className="section-group introduction">
            <label className="section-title">소개</label>
            <textarea
              className="intro-textarea"
              value={introduction}
              placeholder="자신을 자유롭게 소개해주세요"
              onChange={(e) => setIntroduction(e.target.value)}
            />
          </div>

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

        {/* 오른쪽 섹션 */}
        <div className="settings-section">
          <div className="setting-box">
            <h3 className="setting-header">
              <MdOutlineAttachMoney /> 게임별 코인 등록
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

          <div className="setting-game">
            <h3 className="setting-header">
              <GiGamepad /> 선호 게임 설정
            </h3>

            <div className="preference-games">
              {/* PUBG */}
              <div
                className="game-option"
                onClick={() => setPreferredGame("PUBG")}
              >
                <img src={PUBGIcon} alt="배틀그라운드 아이콘" />
                <input
                  type="checkbox"
                  checked={preferredGame === "PUBG"}
                  readOnly
                />
              </div>

              {/* OverWatch */}
              <div
                className="game-option"
                onClick={() => setPreferredGame("OverWatch")}
              >
                <img src={OverIcon} alt="오버워치 아이콘" />
                <input
                  type="checkbox"
                  checked={preferredGame === "OverWatch"}
                  readOnly
                />
              </div>

              {/* LOL */}
              <div
                className="game-option"
                onClick={() => setPreferredGame("LOL")}
              >
                <img src={LOLIcon} alt="리그 오브 레전드 아이콘" />
                <input
                  type="checkbox"
                  checked={preferredGame === "LOL"}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="setting-box tier-verification-box">
            <h3 className="setting-header">
              <FaGamepad /> 게임 별 티어 인증
            </h3>

            <div className="tier-images">
              {tierImages.map((img, index) => (
                <div key={index} className="tier-image-wrapper">
                  {img ? (
                    <img
                      src={img}
                      className="tier-image"
                      alt={`티어 인증 이미지 ${index + 1}`}
                    />
                  ) : (
                    <label
                      htmlFor={`tier-upload-${index}`}
                      className="plus-label"
                    >
                      <FaPlus className="plus-icon-sm" />
                    </label>
                  )}
                  <input
                    type="file"
                    id={`tier-upload-${index}`}
                    className="hidden-file-input"
                    onChange={(e) => handleTierImageChange(index, e)}
                  />
                </div>
              ))}
            </div>
          </div>

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
