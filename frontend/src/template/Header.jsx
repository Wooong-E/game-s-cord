import { faMagnifyingGlass, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import styles from "./Header.module.css";
import coin from "../assets/coin.jpg";
import logo from '../assets/logo.png';
import LeagueofLeagends from "../assets/LeaguofLeagends.jpg"
import Battleground from "../assets/Battleground.jpg"
import overwatch from "../assets/overwatch.jpg"

const Header = () => {
  const [query, setQuery] = useState("");
  const [search, setsearch] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const serviceRef = useRef(null);
  const suggestionRef = useRef(null);


  // 바깥 클릭 시 드롭다운 닫힘
  useEffect(() => {
    const handleClickOutside = (e) => {

      // 서비스 드롭다운 닫기
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setShowServiceDropdown(false);
      }

      // 검색 드롭다운 닫기
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (!search) setShowSuggestions(false);
  }, [search]);

  const handleUserNameSubmit = async (e) => {
    e.preventDefault();

    if(query.trim() === "") return;

    try {
      const res = await axios.get("/api/gamemates/search", {
        params: { userName: query }
      });
      setSuggestions(res.data || []);
      setShowSuggestions(true);
      console.log(res.data);

    } catch (error) {
      console.error("검색 실패", error);
    }
  };

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

        <FontAwesomeIcon className={search ? `${styles.hidden} ${styles.searchicon}` : `${styles.searchicon}`} 
          onClick={()=>setsearch(!search)} 
          icon={faMagnifyingGlass} style={{fontSize:"1.1rem"}} />
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
