import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/JoinGameMatch.css";
import { FaClock, FaGamepad } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import api from "../api/axios";
import Sidebar from "../page/MyPage/Sidebar";
import styles from ".././page/MyPage/MyPage.module.css";

// 게임 목록
const availableGames = [
  { id: 0, name: "게임명 선택" },
  { id: 1, name: "리그 오브 레전드" },
  { id: 2, name: "배틀그라운드" },
  { id: 3, name: "오버워치 2" },
];

// 게임 티어 목록
const availableTiers = [
  { value: "", name: "티어 선택" },
  { value: "S", name: "S" },
  { value: "A", name: "A" },
  { value: "B", name: "B" },
  { value: "C", name: "C" },
  { value: "F", name: "F" },
];

const GameTierSelect = ({ rate, onChange }) => {
  const isGameSelected = rate.name !== "게임명 선택";
  const title = isGameSelected
    ? rate.name
    : `게임 ${rate.id.slice(-1).toUpperCase()} 티어`;
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

//게임별로 시간이 다르게 등록이 되어서 시간은 기본값이 start : 18:00, end: 23:00
const JoinGameMatch = () => {
  const [gameRates, setGameRates] = useState([
    {
      id: "rate-a",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      start: "18:00",
      end: "23:00",
    },
    {
      id: "rate-b",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      start: "18:00",
      end: "23:00",
    },
    {
      id: "rate-c",
      gameId: 0,
      name: "게임명 선택",
      tier: "",
      price: "",
      start: "18:00",
      end: "23:00",
    },
  ]);
  const [availableTime, setAvailableTime] = useState({
    game: "",
    start: "18:00",
    end: "23:00",
  });

  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  // ✔ 수정 페이지 진입 시 PATCH로 기존 데이터 불러오기
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        // GET으로 사용자 gamemate 조회
        const res = await api.get("/gamemates");

        if (res.data && res.data.games && res.data.games.length > 0) {
          const loadedGames = [0, 1, 2].map((idx) => {
            const g = res.data.games[idx]; // 서버에서 해당 인덱스 게임이 있는지
            if (g) {
              return {
                id: ["rate-a", "rate-b", "rate-c"][idx],
                gameId: g.gameId,
                name:
                  availableGames.find((ag) => ag.id === g.gameId)?.name ||
                  "게임명 선택",
                tier: g.tier,
                price: g.price,
                start: g.start,
                end: g.end,
              };
            } else {
              // 서버에 없으면 기본값 채움
              return {
                id: ["rate-a", "rate-b", "rate-c"][idx],
                gameId: 0,
                name: "게임명 선택",
                tier: "",
                price: "",
                start: "18:00",
                end: "23:00",
              };
            }
          });

          setGameRates(loadedGames);

          const firstStart = loadedGames[0].start;
          const firstEnd = loadedGames[0].end;

          setAvailableTime({
            start: firstStart,
            end: firstEnd,
          });

          // 수정 모드로 전환
          setIsRegistered(true);
        }
      } catch (err) {
        console.log("아직 등록 안됨 (신규 등록 모드)");
        setIsRegistered(false);
      }
    };

    fetchExisting();
  }, []);

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
            start: "18:00",
            end: "23:00",
          };
        }
        return { ...rate, [field]: value };
      })
    );
  };

  const handleSubmit = async () => {
    const invalidRate = gameRates.find(
      (g) =>
        g.name !== "게임명 선택" &&
        !isNaN(Number(g.price)) &&
        Number(g.price) > 2000
    );
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
        `${incompleteGameRate.name}에 대해 티어와 코인을 모두 설정해주세요.`
      );
      return;
    }

    if (!availableTime.start || !availableTime.end) {
      alert("이용 가능 시간대를 설정해주세요.");
      return;
    }

    const gamesData = gameRates
      .filter((g) => g.name !== "게임명 선택" && g.price && g.tier)
      .map((g) => ({
        gameId: g.gameId,
        price: Number(g.price),
        tier: g.tier,
        start: availableTime.start + ":00",
        end: availableTime.end + ":00",
      }));

    const jsonData = { games: gamesData };

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    try {
      if (isRegistered) {
        // PATCH(JSON)

        const payload = gameRates.map((g) =>
          g.name !== "게임명 선택"
            ? {
                gameId: g.gameId,
                price: Number(g.price),
                tier: g.tier,
                start: availableTime.start + ":00",
                end: availableTime.end + ":00",
              }
            : {
                gameId: 0, // 기본값
                price: 0, // 기본값
                tier: "", // 빈 문자열
                start: "00:00:00", // 기본 시간
                end: "00:00:00", // 기본 시간
              }
        );

        const request = { games: payload };

        await api.patch("/gamemates", request, {
          headers: { "Content-Type": "application/json" },
        });
        alert("게임메이트 정보 수정 완료!");
      } else {
        // 처음 등록(POST)
        await api.post("/gamemates", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("게임메이트 등록이 완료되었습니다.");
      }

      navigate("/");
    } catch (e) {
      console.error("등록 실패:", e);
      alert(
        `등록 실패: ${e.response?.status} - ${e.response?.data || e.message}`
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className="join-game-match-container">
        <h1 className="page-header">
          {isRegistered ? "게임 메이트 수정" : "게임 메이트 등록"}
        </h1>
        <div className="content-area">
          <div className="profile-section"></div>
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
            {/*} <div className="setting-game">
              <h3 className="setting-header">
                <GiGamepad /> 선호 게임 설정
              </h3>
              <div className="preference-games">
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
            </div>*/}
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
            <div className="available-time">
              <div className="available-time-header">
                <FaClock className="clock-icon" />
                <label className="section-title">이용가능 시간대</label>
              </div>
              <div className="time-game-name-input-row"></div>
              <div className="rate-input-row time-input-row">
                <label>이용 시간:</label>
                <input
                  type="time"
                  value={availableTime.start}
                  onChange={(e) =>
                    setAvailableTime({
                      ...availableTime,
                      start: e.target.value,
                    })
                  }
                  className="time-input"
                />
                <span className="time-separator">~</span>
                <input
                  type="time"
                  value={availableTime.end}
                  onChange={(e) =>
                    setAvailableTime({ ...availableTime, end: e.target.value })
                  }
                  className="time-input"
                />
              </div>
            </div>
            <div className="action-buttons">
              <button className="register-button" onClick={handleSubmit}>
                {isRegistered ? "수정하기" : "등록하기"}
              </button>
              <button className="cancel-button" onClick={() => navigate(-1)}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameMatch;
