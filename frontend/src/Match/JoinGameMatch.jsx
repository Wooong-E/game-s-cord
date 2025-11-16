import React, { useState } from "react";
import "../css/JoinGameMatch.css";
import { FaPlus, FaClock, FaGamepad } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiGamepad } from "react-icons/gi";

import PUBGIcon from "../assets/smallBattle.png";
import TFTIcon from "../assets/smallTFT.png";
import LOLIcon from "../assets/smallLOL.png";
import PUBGTear from "../assets/battleTear.jpg";
import TFTTear from "../assets/baloTear.jpg";
import LOLTear from "../assets/lolTear.jpg";

// 게임별 요금 입력 필드 컴포넌트
const GameRateInput = ({ gameName, rate, onChange }) => (
  <div className="rate-input-row">
    <label>게임 명:</label>
    <input
      type="text"
      name={`gameName-${gameName}`}
      value={gameName}
      placeholder="게임명 입력"
      onChange={onChange}
    />
    <label>요금:</label>
    <div className="rate-input-group">
      <input
        type="number"
        name={`rate-${gameName}`}
        value={rate}
        placeholder="요금"
        onChange={onChange}
      />
      <span>원</span>
    </div>
  </div>
);

const JoinGameMatch = () => {
  // 상태 관리 예시
  const [profileImages, setProfileImages] = useState(Array(5).fill(null));
  const [preferredGame, setPreferredGame] = useState("LOL");
  const [gameRates, setGameRates] = useState([
    { id: 1, name: "리그 오브 레전드", rate: 5000 },
    { id: 2, name: "배틀그라운드", rate: 4000 },
    { id: 3, name: "", rate: "" }, // 추가 가능한 빈 슬롯
  ]);
  const [availableTime, setAvailableTime] = useState({
    game: "",
    time: "--:00",
  });

  // 이미지 처리 함수
  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...profileImages];
      newImages[index] = URL.createObjectURL(file);
      setProfileImages(newImages);
    }
  };

  const handleRateChange = (event) => {
    // ... (실제 상태 업데이트 로직)
  };

  return (
    <div className="join-game-match-container">
      <h1 className="page-header">게임 메이트 등록</h1>

      <div className="content-area">
        {/* 1. 프로필 및 소개 섹션 (왼쪽) */}
        <div className="profile-section">
          {/* 프로필 이미지 박스 */}
          <div className="profile-main-box">
            {profileImages[0] ? (
              <img
                src={profileImages[0]}
                alt="프로필 메인"
                className="profile-image"
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
              title="메인 이미지 업로드"
            ></label>
          </div>
          {/* 서브 이미지 버튼 */}
          <div className="profile-sub-buttons">
            {profileImages.slice(1).map((img, index) => (
              <div key={index + 1} className="sub-image-wrapper">
                {img ? (
                  <img
                    src={img}
                    alt={`프로필 서브 ${index + 1}`}
                    className="profile-image-sm"
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
                  title="서브 이미지 업로드"
                ></label>
              </div>
            ))}
          </div>
          {/* 소개 */}
          <div className="section-group introduction">
            <label className="section-title">소개</label>
            <textarea
              className="intro-textarea"
              placeholder="자신을 자유롭게 소개해주세요 (예: 롤 티어 다이아, 즐겜 선호)"
            />
          </div>
          <div className="available-time">
            <div className="available-time-header">
              <FaClock className="clock-icon" />
              <label className="section-title">이용가능 시간대</label>
            </div>
            {/* 1. 게임명 입력 그룹 */}
            <div className="time-game-name-input-row">
              <p className="game-name-label">게임명:</p>
              <input
                type="text"
                placeholder="게임명"
                value={availableTime.game}
                onChange={(e) =>
                  setAvailableTime({ ...availableTime, game: e.target.value })
                }
              />
            </div>
            {/* 2. 시간 입력 그룹 */}
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

        {/* 2. 요금 및 설정 섹션 (오른쪽) */}
        <div className="settings-section">
          {/* 게임 별 요금 등록 */}
          <div className="setting-box">
            <h3 className="setting-header">
              <MdOutlineAttachMoney /> 게임 별 요금 등록
            </h3>
            <div className="rate-inputs">
              {gameRates.map((rate) => (
                <GameRateInput
                  key={rate.id}
                  gameName={rate.name}
                  rate={rate.rate}
                  onChange={handleRateChange}
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
                  onChange={() => setPreferredGame("PUBG")}
                />
              </div>
              <div
                className="game-option"
                onClick={() => setPreferredGame("SC")}
              >
                <img src={TFTIcon} alt="TFT" />
                <input
                  type="checkbox"
                  checked={preferredGame === "SC"}
                  onChange={() => setPreferredGame("SC")}
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
                  onChange={() => setPreferredGame("LOL")}
                />
              </div>
            </div>
          </div>

          {/* 게임 별 티어 인증 */}
          <div className="setting-box tier-verification-box">
            <h3 className="setting-header">
              <FaGamepad /> 게임 별 티어 인증
            </h3>
            <div className="tier-images">
              <div className="tier-image-wrapper">
                <img src={TFTTear} alt="티어 인증 1" className="tier-image" />
              </div>
              <div className="tier-image-wrapper">
                <img src={PUBGTear} alt="티어 인증 2" className="tier-image" />
              </div>
              <div className="tier-image-wrapper">
                <img src={LOLTear} alt="티어 인증 3" className="tier-image" />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="register-button">등록하기</button>
            <button className="cancel-button">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameMatch;
