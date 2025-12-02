import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import styles from "./Search.module.css"
import coin from "../assets/coin.jpg"
import crown from "../assets/crown.jpg"
import user1 from "../assets/user1.png"
import user2 from "../assets/user2.png"
import user3 from "../assets/user3.png"
import user4 from "../assets/user4.png"
import user5 from "../assets/user5.png"
import user6 from "../assets/user6.png"
import user7 from "../assets/user7.png"

function Search() {
  const location = useLocation();
  const [showGame, setShowGame] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [filters, setFilters] = useState({
    gameId: "",
    game: "",       // 게임 종류(리그 오브 레전드 / 배틀그라운드 / 오버워치)
    gender: "",     // 성별(남 / 여 / 모두)
    rank: "",        // 티어 / 랭크(S, A, B, C, F)
    sortBy:"reviewsScore"
  });
  const [filterHistory, setFilterHistory] = useState([]);

  const user = [user1, user2, user3, user4, user5, user6, user7];
  
  const dropdownGameRef = useRef(null);
  const dropdownGenderRef = useRef(null);
  const dropdownRankRef = useRef(null);
  const dropdownSortRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!location.state?.gameId) return;

    const id = location.state.gameId;

    const gameNameMap = {
      1: "리그 오브 레전드",
      2: "배틀그라운드",
      3: "오버워치"
    };

    setFilters(prev => ({
      ...prev,
      gameId: id,
      game: gameNameMap[id],
      sortBy: "reviewsScore"
    }));

    // 필터 히스토리에도 자동 추가
    addFilterHistory("game", gameNameMap[id]);
    addFilterHistory("sortBy", "평점순");
  }, [location.state]);


  //API 요청 함수
  const fetchResults = async () => {
      try {
        const res = await api.get(`/gamemates/filter`, {
          params: {
            gameId: filters.gameId || undefined,
            gender: filters.gender || undefined,
            tier: filters.rank || undefined,
            sortBy: filters.sortBy || undefined
          }
        });
        setSearchResults(res.data);
        console.log(res.data);
      } catch (e) {
        console.error("검색 결과 불러오기 실패:", e);
      }
    };

  //API 요청
  useEffect(() => {
    fetchResults();
  }, [filters]);

  //필터 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownGameRef.current && !dropdownGameRef.current.contains(e.target)) {
        setShowGame(false);
      }
      if (dropdownGenderRef.current && !dropdownGenderRef.current.contains(e.target)) {
        setShowGender(false);
      }
      if (dropdownRankRef.current && !dropdownRankRef.current.contains(e.target)) {
        setShowRank(false);
      }
      if (dropdownSortRef.current && !dropdownSortRef.current.contains(e.target)) {
          setShowSort(false);
      }
  };
    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  //filterHistory 관리
  const addFilterHistory = (key, label) => {
    setFilterHistory((prev) => {
      const existingIndex = prev.findIndex(item => item.key === key);

      // 이미 존재하는 key → 순서 유지 + label만 변경
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { key, label };
        return updated;
      }

      // game은 항상 맨 앞
      if (key === "game") {
        return [{ key, label }, ...prev];
      }

      // 새 필터는 맨 뒤에 추가
      return [...prev, { key, label }];
    });
  };

  //필터 적용
  const handleGameFilter = (value) => {
    const gameMap = {
      "리그 오브 레전드": 1,
      "배틀그라운드": 2,
      "오버워치": 3,
    };

    setFilters((prev) => ({
      ...prev,
      game: value,
      gameId: gameMap[value]  // gameId도 반드시 같이 바꿔줘야 함!!
    }));

    addFilterHistory("game", value);
    setShowGame(false);
  };
  const handleGenderFilter = (value) => {
    setFilters((prev) => ({
      ...prev,
      gender: value
    }));
    addFilterHistory("gender", value);
    setShowGender(false);
  };
  const handleRankFilter = (value) => {
    setFilters((prev) => ({
      ...prev,
      rank: value
    }));
    addFilterHistory("rank", value);
    setShowRank(false);
  };

  const handleSortFilter = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));

    const sortLabelMap = {
      reviewsScore: "평점순",
      reviewsCount: "인기순",
      highPrice: "가격 높은 순",
      lowPrice: "가격 낮은 순",
    };

    addFilterHistory("sortBy", sortLabelMap[value]);
    setShowSort(false);
  };


  const removeFilter = (key) => {
    if (key == "game") return;
    setFilters((prev) => ({ ...prev, [key]: "" }));
    setFilterHistory((prev) => prev.filter((item) => item.key !== key));
  };

  const Usercard=({index, img, name, star, price})=>{
    return(
      <div className={styles.Userbox}
      onClick={() => navigate("/matchdetail", { state: { userId } })}
      style={{ cursor: "pointer" }}
      >
        <div style={{height:"200px", display:"flex", alignItems:"end", justifyContent:"center"}}>
          <img src={user[index]} style={{height:"170px"}}></img>
        </div>
        <div className={styles.Userbio}>
          <div style={{fontSize:"18px", fontWeight:"bold"}}>{name}</div>
          <div style={{marginBottom:"-3px", display:"flex", alignItems:"center"}}>
            <img src={crown} style={{width:"18px", height:"14px", marginLeft:"1px", marginRight:"4px"}}></img> 
            <div>Level : {star}</div> 
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"3px"}}>
            <img src={coin} style={{width:"20px", borderRadius:"50%"}}/>
            <div style={{marginBottom:"1px"}}>{price}코인/판</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div style={{display:"flex", flexDirection:"row", alignItems:"end", justifyContent:"space-between"}}>
          <h1>
            {filters.game ? `${filters.game} 검색` : "서비스 검색"}
          </h1>
        </div>
        <div className={styles.filter}>
          <div style={{display: "flex", gap: "10px"}} >
            <div ref={dropdownGameRef} style={{position: "relative"}}>
              <button className={filters.game ? styles.border : ""} type="button" onClick={(e) =>{e.stopPropagation(); setShowGame((prev) => !prev);}}>게임 종류</button>
              <ul className={showGame ? styles.show : ""} style={{width:"150px"}}>
                <li onClick={() => {handleGameFilter("리그 오브 레전드")}}>리그 오브 레전드</li>
                <li onClick={() => {handleGameFilter("배틀그라운드")}}>배틀그라운드</li>
                <li onClick={() => {handleGameFilter("오버워치")}}>오버워치</li>
              </ul>
            </div>

            <div ref={dropdownRankRef} style={{position: "relative"}}>
              <button className={filters.rank ? styles.border : ""} type="button" onClick={(e) =>{e.stopPropagation(); setShowRank((prev) => !prev);}}>티어/랭크</button>
              <ul className={showRank ? styles.show : ""} style={{width:"60px", textAlign:"center"}}>
                <li onClick={()=>{handleRankFilter("S")}}>S</li>
                <li onClick={()=>{handleRankFilter("A")}}>A</li>
                <li onClick={()=>{handleRankFilter("B")}}>B</li>
                <li onClick={()=>{handleRankFilter("C")}}>C</li>
                <li onClick={()=>{handleRankFilter("F")}}>F</li>
              </ul>
            </div>
            <div ref={dropdownGenderRef} style={{position: "relative"}}>
              <button className={filters.gender ? styles.border : ""} type="button" onClick={(e) =>{e.stopPropagation(); setShowGender((prev) => !prev);}}>성별</button>
              <ul className={showGender ? styles.show : ""}style={{width:"60px"}}>
                <li onClick={() => {handleGenderFilter("남")}}>남성</li>
                <li onClick={() => {handleGenderFilter("여")}}>여성</li>
              </ul>
            </div>
          </div>
          <div ref={dropdownSortRef} style={{position: "relative"}}>
            <button
              className={filters.sortBy ? styles.border : ""} type="button"
              onClick={(e) => { e.stopPropagation(); setShowSort(prev => !prev); }}
            >
              정렬순
            </button>

            <ul className={showSort ? styles.show : ""} style={{ width: "120px" }}>
              <li onClick={() => handleSortFilter("reviewsScore")}>평점순</li>
              <li onClick={() => handleSortFilter("reviewsCount")}>인기순</li>
              <li onClick={() => handleSortFilter("highPrice")}>가격 높은 순</li>
              <li onClick={() => handleSortFilter("lowPrice")}>가격 낮은 순</li>
            </ul>
          </div>

        </div>

        <div className={styles.activeFilters}>
            {filterHistory.map((f, index) => (
              <div key={index} className={styles.filterTag}>
                {f.label}
                {f.key !== "game" && f.key !== "sortBy" && (
                  <button onClick={() => removeFilter(f.key)}>✕</button>
                )}
              </div>
            ))}
          </div>

        <div style={{display:"flex", marginTop: "30px", flexWrap:"wrap", gap:"40px"}}>
          {searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <Usercard
                index={index}
                key={index}
                img={user.profileImageUrl || user1}  // 기본 이미지
                name={user.userName}
                star={user.tier}
                price={user.price}
              />
            ))
          ) : (
            <div style={{ marginTop: "30px", fontSize: "18px", height: "280px" }}>
              검색 결과가 없습니다.
            </div>
          )}

        </div>
      </div>
    </div>
    
  )
}
export default Search