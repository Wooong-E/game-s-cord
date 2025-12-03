import React, { useState } from "react";
import "../css/JoinGameMatch.css";
import { FaPlus, FaClock, FaGamepad } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiGamepad } from "react-icons/gi";
import PUBGIcon from "../assets/smallBattle.png";
import LOLIcon from "../assets/smallLOL.png";
import OverIcon from "../assets/smallOver.png";
import api from "../api/axios";

// 게임 목록
const availableGames = [
  { id: 0, name: "게임명 선택" },
  { id: 1, name: "리그 오브 레전드" },
  { id: 2, name: "배틀그라운드" },
  { id: 3, name: "오버워치 2" },
];

// 게임 티어 목록 (예시)
const availableTiers = [
  { value: "", name: "티어 선택" },
  { value: "B", name: "브론즈" },
  { value: "S", name: "실버" },
  { value: "G", name: "골드" },
  { value: "P", name: "플래티넘" },
  { value: "D", name: "다이아몬드" },
  { value: "M", name: "마스터" },
  { value: "G", name: "그랜드마스터" },
];

const GameTierSelect = ({ rate, onChange }) => {
  const isGameSelected = rate.name !== "게임명 선택";

  const title =
    rate.name === "게임명 선택"
      ? `게임 ${rate.id.slice(-1).toUpperCase()} 티어`
      : rate.name;

  // 선택된 티어 이름 찾기
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
      {/* 선택된 티어 표시 (선택되지 않은 경우 기본값) */}
      <p className="selected-tier-display">
        {isGameSelected ? selectedTierName : "게임을 먼저 선택"}
      </p>
    </div>
  );
};

// GameRateInput 컴포넌트 (time 제거)
const GameRateInput = ({ rate, onChange, selectedNames }) => {
  const isGameSelected = rate.name !== "게임명 선택";

  return (
    <div className="rate-input-group-extended">
      {/* 게임 명 및 코인 입력 */}
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
  // 파일 객체 저장을 위한 상태 (FormData 전송용)
  const [profileFiles, setProfileFiles] = useState(Array(5).fill(null));
  // 미리보기 URL 저장을 위한 상태
  const [profileImages, setProfileImages] = useState(Array(5).fill(null));

  const [preferredGame, setPreferredGame] = useState("LOL");

  // **수정된 상태: time 필드 제거**
  const [gameRates, setGameRates] = useState([
    {
      id: "rate-a",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      // time 필드 제거
    },
    {
      id: "rate-b",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      // time 필드 제거
    },
    {
      id: "rate-c",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      // time 필드 제거
    },
  ]);

  // **제거된 상태: availableTime 상태 제거 (더 이상 사용하지 않음)**
  // const [availableTime, setAvailableTime] = useState({ game: "", time: "--:00" });

  const [introduction, setIntroduction] = useState("");

  const selectedNames = gameRates
    .map((g) => g.name)
    .filter((n) => n && n !== "게임명 선택");

  // **수정된 함수: time 초기화 로직 제거**
  const handleRateChange = (id, field, value) => {
    setGameRates((prev) =>
      prev.map((rate) => {
        if (rate.id !== id) return rate;

        if (field === "name") {
          const found = availableGames.find((g) => g.name === value);
          // 게임명 변경 시, gameId 변경 및 티어/가격 초기화 (time 초기화 제거)
          return {
            ...rate,
            name: value,
            gameId: found?.id ?? rate.gameId,
            tier: "",
            price: "",
            // time 필드 초기화 제거
          };
        }

        return { ...rate, [field]: value };
      })
    );
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // 미리보기 URL 저장
      const newImages = [...profileImages];
      newImages[index] = URL.createObjectURL(file);
      setProfileImages(newImages);

      // 파일 객체 저장 (전송용)
      const newFiles = [...profileFiles];
      newFiles[index] = file;
      setProfileFiles(newFiles);
    }
  };

  const handleSubmit = async () => {
    const invalidRate = gameRates.find((g) => {
      const price = Number(g.price);
      return g.name !== "게임명 선택" && !isNaN(price) && price > 2000;
    });
    if (invalidRate) {
      alert(
        "등록하려는 게임 코인 중 2000코인을 초과하는 항목이 있습니다. 코인을 2000이하로 설정해주세요."
      );
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
      .map((g) => {
        const PLACEHOLDER_START_TIME = "18:00:00";
        const PLACEHOLDER_END_TIME = "23:00:00";
        return {
          gameId: g.gameId,
          price: Number(g.price),
          tier: g.tier,
          start: g.start || PLACEHOLDER_START_TIME,
          end: g.end || PLACEHOLDER_END_TIME,
        };
      });

    const jsonData = { games: gamesData, introduction };

    console.log("전송 데이터 (JSON):", jsonData);

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    profileFiles.forEach((file, index) => {
      if (file) {
        const fileNamePrefix =
          index === 0 ? "profile_main" : `profile_sub_${index}`;
        formData.append("image", file, `${fileNamePrefix}_${file.name}`);
      }
    });

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("인증 토큰이 없습니다. 로그인 상태를 확인해주세요.");
      return;
    }

    try {
      const response = await api.post("/gamemates", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("게임 메이트 등록이 완료되었습니다.");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        let errorData = error.response.data;
        let errorText;

        if (typeof errorData === "object" && errorData !== null) {
          try {
            errorText = JSON.stringify(errorData).substring(0, 100);
          } catch {
            errorText = "서버 응답 데이터(객체) 처리 오류";
          }
        } else {
          errorText = (errorData || "서버 오류").toString().substring(0, 100);
        }

        alert(`등록 실패: ${status} - ${errorText}...`);
      } else {
        alert(`네트워크 오류 발생: ${error.message}`);
      }
    }
  };

  return (
    <div className="join-game-match-container">
      <h1 className="page-header">게임 메이트 등록</h1>

      <div className="content-area">
        {/* 왼쪽 영역 (동일) */}
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

          {/* **제거된 영역: 이용가능 시간대 (availableTime)** */}
          {/* <div className="available-time">
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
          </div> */}
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
              <FaGamepad /> 게임 별 티어 선택
            </h3>

            <div className="tier-images">
              {/* gameRates의 3개 항목 각각에 대해 티어 선택 컴포넌트를 렌더링 */}
              {gameRates.map((rate) => (
                <GameTierSelect
                  key={rate.id}
                  rate={rate}
                  onChange={handleRateChange}
                />
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
