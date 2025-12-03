import {
  faMagnifyingGlass,
  faAngleUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import styles from "./Header.module.css";
import useAuth from "../login/useAuth.js";
import useLogout from "../login/Logout.js";

import coin from "../assets/coin.jpg";
import logo from "../assets/logo.png";
import LeagueofLeagends from "../assets/LeaguofLeagends.jpg";
import Battleground from "../assets/Battleground.jpg";
import overwatch from "../assets/Overwatch.jpg";
import logo_img from "../assets/logo_profile.png";

const Header = () => {
  const [query, setQuery] = useState("");
  const [search, setsearch] = useState(false);
  const isLoggedIn = useAuth();
  const logout = useLogout();
  const [coinBalance, setCoinBalance] = useState(0);

  // User 검색
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shownoSuggestions, setShownoSuggestions] = useState(false);

  // 서비스
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // 알림
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notiEnabled, setNotiEnabled] = useState(true); 

  const serviceRef = useRef(null);
  const suggestionRef = useRef(null);
  const nosuggestionRef = useRef(null);
  const notiRef = useRef(null);

  const navigate = useNavigate();

  // 클릭 outside → 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 서비스
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setShowServiceDropdown(false);
      }

      // 검색
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }

      // no 결과 박스
      if (
        nosuggestionRef.current &&
        !nosuggestionRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }

      // 알림
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNoti(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 검색 숨기기
  useEffect(() => {
    if (!search) setShowSuggestions(false);
  }, [search]);

  // userId별 그룹
  const groupByUserId = (list) => {
    const map = {};
    list.forEach((item) => {
      if (!map[item.userId]) {
        map[item.userId] = { ...item, games: [] };
      }
      map[item.userId].games.push({
        gameId: item.gameId,
        gameName: item.gameName,
        tier: item.tier,
        price: item.price,
      });
    });
    return Object.values(map);
  };

  // 유저 검색 API
  const handleUserNameSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await api.get("/gamemates/search", {
        params: { userName: query },
      });

      const grouped = groupByUserId(res.data);
      setSuggestions(grouped);
      setShowSuggestions(true);
      setShownoSuggestions(grouped.length === 0);
    } catch (error) {
      console.error("검색 실패", error);
    }
  };
  //코인 잔액확인 api
  const fetchCoinbalance = async () =>{
    try {
      const res = await api.get("/coins/balance");
      setCoinBalance(res.data.balance);
    } catch(error){
      console.error("코인 잔액 로드 실패:", error);
    }
  }

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.get("/notifications");
      setNotifications(res.data);
      console.log(res.data);
    } catch (e) {
      console.error("알림 불러오기 실패:", e);
      alert("알림 내역 로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // unread count 불러오기
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/notifications/unread-count");
        setUnreadCount(res.data.unreadCount);
        console.log(res.data);
      } catch (e) {
        console.error("안 읽은 알림 개수 조회 실패:", e);
      }
    };

    fetchUnreadCount();
  }, []);

  // 알람 off 시 unreadcount = 0
  useEffect(() => {
    if (!notiEnabled) {
      setUnreadCount(0);
    }
  }, [notiEnabled]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCoinbalance();
    }
  }, [isLoggedIn]);

  // 알림 bell 클릭 → 읽음 처리
  const handleBellClick = async () => {
    if (!isLoggedIn) {
      alert("로그인을 먼저 해주세요!");
      navigate("/login");
      return;
    }
    
    const newState = !showNoti;
    setShowNoti(newState);
    if (newState) {
      try {
        const token = localStorage.getItem("accessToken");
        await api.patch(
          "/notifications/read-all",
          {}
        );
        fetchNotifications();
        setUnreadCount(0);
      } catch (e) {
        console.error("알림 읽음 처리 실패:", e);
        alert("알림 설정 변경에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await api.delete(`/notifications/${notificationId}`);

      navigate("/search");
      setShowNoti(false);
      fetchNotifications();
    } catch (e) {
      console.error("알림 삭제 실패:", e);
    }
  };

  function translateGameName(gameName) {
    switch (gameName) {
      case "League of Legends":
        return "리그 오브 레전드";
      case "Battlegrounds":
        return "배틀 그라운드";
      case "Overwatch":
        return "오버워치";
      default:
        return gameName;
    }
} 

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <Link className={`${styles.link} ${styles.logobox}`} to="/" onClick={() => setsearch(false)}>
          <img src={logo} className={styles.logo} />
        </Link>

        {/* 서비스 메뉴 */}
        <div className={styles.serviceWrapper} ref={serviceRef}>
          <div
            className={styles.serviceBtn}
            onClick={() => setShowServiceDropdown((prev) => !prev)}
          >
            서비스
            {showServiceDropdown ? (
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ marginLeft: "5px" }}
              />
            ) : (
              <FontAwesomeIcon icon={faAngleUp} style={{ marginLeft: "5px" }} />
            )}
          </div>

          {showServiceDropdown && (
            <ul className={styles.dropdownMenu}>
              <li
                onClick={() => {
                  setShowServiceDropdown(false);
                  navigate("/search", { state: { gameId: 1 } });
                }}
              >
                <img src={LeagueofLeagends} />
                <div>리그 오브 레전드</div>
              </li>
              <li
                onClick={() => {
                  setShowServiceDropdown(false);
                  navigate("/search", { state: { gameId: 2 } });
                }}
              >
                <img src={Battleground} />
                <div>배틀그라운드</div>
              </li>
              <li
                onClick={() => {
                  setShowServiceDropdown(false);
                  navigate("/search", { state: { gameId: 3 } });
                }}
              >
                <img src={overwatch} />
                <div>오버워치</div>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* 검색 */}
      <div className={styles.section}>
        <form
          onSubmit={handleUserNameSubmit}
          className={
            search ? styles.search : `${styles.search} ${styles.hidden}`
          }
        >
          <input
            type="text"
            placeholder="유저 이름"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
            >
              ✕
            </button>
          )}
          <button type="submit"></button>

          {showSuggestions && (
            <ul
              ref={suggestions.length > 0 ? suggestionRef : nosuggestionRef}
              className={styles.suggestionBox}
            >
              {suggestions.length === 0 ? (
                <li className={styles.noResult}>
                  해당 유저가 존재하지 않습니다
                </li>
              ) : (
                suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className={styles.suggestionItem}
                    onClick={() => {
                      navigate("/matchdetail", { state: { userId : item.userId } });
                      setShowSuggestions(false);
                      setQuery("");
                    }}
                  >
                    <img
                      src={!item.profileImageUrl
                          ? logo_img
                          : item.profileImageUrl.startsWith("http://example.com/")
                              ? logo_img
                              : encodeURI(item.profileImageUrl)}
                      className={styles.suggestionAvatar}
                    />

                    <div className={styles.suggestionCenter}>
                      <div className={styles.suggestionName}>
                        {item.userName}
                      </div>
                      <div className={styles.suggestionSkill}>
                        Skill:{" "} 
                        {(item.games || [])
                        .map((g) => translateGameName(g.gameName))
                        .join(", ")}
                      </div>
                    </div>

                    <div className={styles.suggestionRight}>
                      ID: {item.userId}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </form>

        <FontAwesomeIcon
          className={
            search ? `${styles.hidden} ${styles.searchicon}` : styles.searchicon
          }
          onClick={() => setsearch(!search)}
          icon={faMagnifyingGlass}
        />

        {/* 알림 */}
        <div ref={notiRef} className={styles.notiWrapper}>
          <div className={styles.bellWrapper} onClick={handleBellClick}>
            <FontAwesomeIcon icon={faBell} className={styles.bellIcon} />
            {notiEnabled && unreadCount > 0 && (
              <div className={styles.badge}>{unreadCount}</div>
            )}
          </div>

          {showNoti && (
            <div className={styles.notiDropdown}>
              <div className={styles.notiHeader}>
                알림
                <label className={styles.notiToggle}>
                  <input
                    type="checkbox"
                    checked={notiEnabled}
                    onChange={() => {
                      setNotiEnabled(!notiEnabled);
                    }}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.notiList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyNoti}>알림이 없습니다.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.notificationId}
                      className={`${styles.notiItem} ${
                        n.notificationType === "REQUEST"
                          ? styles.request
                          : n.notificationType === "ACCEPTED"
                          ? styles.accept
                          : n.notificationType === "DECLINED"
                          ? styles.decline
                          : ""
                      }`}
                      onClick={() => handleNotificationClick(n.id)}
                    >
                      <b style={{ fontSize: "14px" }}>{n.message}</b>

                      {/* ACCEPTED 타입이면 상대방 게임 ID 표시 */}
                      {n.notificationType === "ACCEPTED" && n.matchId && (
                        <div style={{ fontSize: "12px", marginTop: "4px", color: "#666" }}>
                          매칭 게임 ID: {n.matchId}
                        </div>
                      )}

                      <div className={styles.notiTime}>
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link className={styles.link} to="/coin">
          <img src={coin} className={styles.coin} />
          <span>({coinBalance})</span>
        </Link>

        {isLoggedIn ? (
          <>
            <Link className={`${styles.link} ${styles.login}`} to="/Mypage">
              MyPage
            </Link>
            <button
              className={`${styles.link} ${styles.logout}`}
              onClick={logout}
              style={{}}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className={`${styles.link} ${styles.login}`} to="/login">
              Login
            </Link>
            <Link className={`${styles.link} ${styles.join}`} to="/signup">
              Join
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
