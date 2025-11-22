<<<<<<< Updated upstream
import { faMagnifyingGlass, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
=======
<<<<<<< Updated upstream
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
=======
import { faMagnifyingGlass, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
>>>>>>> Stashed changes
>>>>>>> Stashed changes
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import styles from "./Header.module.css";
<<<<<<< Updated upstream
import coin from "../assets/coin.jpg";
import logo from '../assets/logo.png';
import LeagueofLeagends from "../assets/LeaguofLeagends.jpg"
import Battleground from "../assets/Battleground.jpg"
import overwatch from "../assets/overwatch.jpg"

const Header = () => {
=======
<<<<<<< Updated upstream
import coin from '../assets/coin.jpg';

const Header = () => {
=======
import coin from "../assets/coin.jpg";
import logo from '../assets/logo.png';
import LeagueofLeagends from "../assets/LeaguofLeagends.jpg";
import Battleground from "../assets/Battleground.jpg";
import overwatch from "../assets/overwatch.jpg";
import user from "../assets/user2.png";

const Header = () => {
>>>>>>> Stashed changes
  const [query, setQuery] = useState("");
  const [search, setsearch] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

<<<<<<< Updated upstream
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const serviceRef = useRef(null);
  const suggestionRef = useRef(null);
=======
  //User 검색
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shownoSuggestions, setShownoSuggestions] = useState(false);
  const serviceRef = useRef(null);
  const suggestionRef = useRef(null);
  const nosuggestionRef = useRef(null);

  //알림
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

const notiRef = useRef(null);


  const location = useLocation();
  const navigate = useNavigate();
  
>>>>>>> Stashed changes


  // 바깥 클릭 시 드롭다운 닫힘
  useEffect(() => {
    const handleClickOutside = (e) => {

<<<<<<< Updated upstream
      // 서비스 드롭다운 닫기
=======
      // 서비스
>>>>>>> Stashed changes
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setShowServiceDropdown(false);
      }

<<<<<<< Updated upstream
      // 검색 드롭다운 닫기
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
=======
      // 검색
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }

      // 검색 결과X
      if (nosuggestionRef.current && !nosuggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }

      // 알림
      if (notiRef.current && !notiRef.current.contains(e.target)) {
          setShowNoti(false);
      }
>>>>>>> Stashed changes
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (!search) setShowSuggestions(false);
  }, [search]);

<<<<<<< Updated upstream
=======
  // 유저 검색 API
>>>>>>> Stashed changes
  const handleUserNameSubmit = async (e) => {
    e.preventDefault();

    if(query.trim() === "") return;

    try {
      const res = await axios.get("/api/gamemates/search", {
        params: { userName: query }
      });
<<<<<<< Updated upstream
      setSuggestions(res.data || []);
      setShowSuggestions(true);
=======
      const grouped = groupByUserId(res.data);
      setSuggestions(grouped || []);
      setShowSuggestions(true);
      setShownoSuggestions(grouped.length === 0);
>>>>>>> Stashed changes
      console.log(res.data);

    } catch (error) {
      console.error("검색 실패", error);
    }
  };

<<<<<<< Updated upstream
=======
  //userId 별로 묶기
  const groupByUserId = (list) => {
    const map = {};

    list.forEach(item => {
      if (!map[item.userId]) {
        map[item.userId] = {
          ...item,
          games: []
        };
      }

      map[item.userId].games.push({
        gameId: item.gameId,
        gameName: item.gameName,
        tier: item.tier,
        price: item.price
      });
    });

    return Object.values(map);
  };

  //알림 API
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (e) {
      console.error("알림 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("/api/notifications/unread-count", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUnreadCount(res.data);
      } catch (e) {
        console.error("안 읽은 알림 개수 조회 실패:", e);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleBellClick = async () => {
    const newState = !showNoti;
    setShowNoti(newState);

    if (newState) {
      // 드롭다운을 여는 순간 → 모든 알림 읽음 처리
      try {
        const token = localStorage.getItem("accessToken");

        await axios.patch("/api/notifications/read-all", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 읽음 처리 후 최신 알림 상태 다시 불러오기
        fetchNotifications();
        setUnreadCount(0);

      } catch (e) {
        console.error("알림 읽음 처리 실패:", e);
      }
    }
  };

>>>>>>> Stashed changes
>>>>>>> Stashed changes
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <Link className={styles.link} to="/" onClick={()=>setsearch(false)}>
        <img src={logo} style={{width:"100px", paddingLeft:"40px"}}></img></Link>
                <div className={styles.serviceWrapper} ref={serviceRef}>
          <div className={styles.serviceBtn}
            onClick={() => setShowServiceDropdown(prev => !prev)}>서비스
            {showServiceDropdown ? <FontAwesomeIcon icon={faAngleDown} style={{fontSize: "0.9rem", marginLeft: "5px"}}/>
             : <FontAwesomeIcon icon={faAngleUp} style={{fontSize: "0.9rem", marginLeft: "5px"}}/>}
            </div>

          {showServiceDropdown && (
            <ul className={styles.dropdownMenu}>
              <li onClick={() => {setShowServiceDropdown(false); navigate("/search", { state: { gameId: 1 } })}}>
                <img src={LeagueofLeagends}/>
                <div>리그 오브 레전드</div>
              </li>
              <li onClick={() => {setShowServiceDropdown(false); navigate("/search", { state: { gameId: 2 } })}}>
                <img src={Battleground}/>
                <div>배틀그라운드</div>
              </li>
              <li onClick={() => {setShowServiceDropdown(false); navigate("/search", { state: { gameId: 3 } })}}>
                <img src={overwatch}/>
                <div>오버워치</div>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className={styles.section}>
<<<<<<< Updated upstream
        <form onSubmit={handleUserNameSubmit} className={search ? `${styles.search}` : `${styles.search} ${styles.hidden}`}>
              <input type="text" name="q" 
                placeholder="유저 이름" value={query} 
                onChange={(e) => setQuery(e.target.value)}/>
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
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul ref={suggestionRef} className={styles.suggestionBox}>
            {suggestions.map((item, index) => (
              <li 
                key={index}
                className={styles.suggestionItem}
                onClick={() => {
                  navigate("/search", { state: { keyword: item.userName } });
                  setShowSuggestions(false);
                  setQuery("");
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <img 
                    src={item.profileImageUrl || "/defaultUser.png"} 
                    style={{ width: "40px", height: "40px", borderRadius:"50%" }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{item.userName}</div>
                    <div style={{ fontSize: "13px", color: "#555" }}>
                      Skill: {item.gameName || "정보 없음"}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize:"12px", color:"#7b7b7b" }}>
                  ID: {item.userId}
                </span>
              </li>
            ))}
          </ul>
        )}
=======
<<<<<<< Updated upstream
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize:"1.1rem"}}/>
=======
        <form onSubmit={handleUserNameSubmit} className={search ? `${styles.search}` : `${styles.search} ${styles.hidden}`}>
          <input type="text" name="q" 
            placeholder="유저 이름" value={query} 
            onChange={(e) => setQuery(e.target.value)}/>
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
                suggestions.map((item, index) => (
                  <li 
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => {
                      navigate("/", { state: { keyword: item.userName } });
                      setShowSuggestions(false);
                      setQuery("");
                    }}
                  >
                    <div className={styles.suggestionLeft}>
                      <img
                        src={item.profileImageUrl || user}
                        className={styles.suggestionAvatar}
                      />
                    </div>

                    <div className={styles.suggestionCenter}>
                      <div className={styles.suggestionName}>{item.userName}</div>
                      <div className={styles.suggestionSkill}>
                        Skill: {item.games?.map(g => g.gameName).join(", ")}
                      </div>
                    </div>

                    <div className={styles.suggestionRight}>ID: {item.userId}</div>
                  </li>
                ))
              )}
            </ul>
          )}

        </form>
>>>>>>> Stashed changes

        <FontAwesomeIcon className={search ? `${styles.hidden} ${styles.searchicon}` : `${styles.searchicon}`} 
          onClick={()=>setsearch(!search)} 
          icon={faMagnifyingGlass} style={{fontSize:"1.1rem"}} />
<<<<<<< Updated upstream
=======

        <div ref={notiRef} className={styles.notiWrapper}>
          <div className={styles.bellWrapper} onClick={handleBellClick}>
          <FontAwesomeIcon icon={faBell} className={styles.bellIcon} />

          {unreadCount > 0 && (
            <div className={styles.badge}>
              {unreadCount}
            </div>
          )}
        </div>

          {showNoti && (
            <div className={styles.notiDropdown}>
              <div className={styles.notiHeader}>
                <span>알림</span>
              </div>

              <div className={styles.notiList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyNoti}>알림이 없습니다.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.notificationId}
                      className={`${styles.notiItem} ${
                        n.notificationType === "ACCEPTED"
                          ? styles.accept
                          : n.notificationType === "DECLINED"
                          ? styles.decline
                          : styles.request
                      }`}
                    >
                      <div className={styles.notiText}>
                        <b>{n.message}</b>
                      </div>
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
        
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        <Link className={styles.link} to="/">
          <img src={coin} alt="coin" className={styles.coin}></img>
          <span>충전</span>
        </Link>
        <Link className={`${styles.link} ${styles.login}`} to="/login">
          Login
        </Link>
        <Link className={`${styles.link} ${styles.join}`} to="/signup">
          Join
        </Link>
      </div>
    </div>
  );
};

export default Header;
