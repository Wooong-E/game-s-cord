import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import styles from "./Search.module.css"
import coin from "../assets/coin.jpg"
import user1 from "../assets/user1.png"
import user2 from "../assets/user2.png"
import user3 from "../assets/user3.png"
import user4 from "../assets/user4.png"
import user5 from "../assets/user5.png"
import user6 from "../assets/user6.png"
import user7 from "../assets/user7.png"

function Search() {
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const dropdownGameRef = useRef(null);
  const dropdownPriceRef = useRef(null);
  const dropdownGenderRef = useRef(null);
  const dropdownOrderRef = useRef(null);
  const dropdownRankRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryValue = params.get("q") || "";
    setKeyword(queryValue);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownGameRef.current && !dropdownGameRef.current.contains(e.target)) {
        setShowGame(false);
      }
      if (dropdownPriceRef.current && !dropdownPriceRef.current.contains(e.target)) {
        setShowPrice(false);
      }
      if (dropdownGenderRef.current && !dropdownGenderRef.current.contains(e.target)) {
        setShowGender(false);
      }
      if (dropdownOrderRef.current && !dropdownOrderRef.current.contains(e.target)) {
        setShowOrder(false);
      }
      if (dropdownRankRef.current && !dropdownRankRef.current.contains(e.target)) {
        setShowRank(false);
      }
  };
    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);


  const user = [user1, user2, user3, user4, user5, user6, user7];
  const Usercard=({img, name, star, num, price})=>{
    return(
      <div className={styles.Userbox}>
        <div style={{height:"200px", display:"flex", alignItems:"end", justifyContent:"center"}}>
          <img src={img} style={{height:"170px"}}></img>
        </div>
        <div className={styles.Userbio}>
          <div style={{fontSize:"18px", fontWeight:"bold", marginBottom:"5px"}}>{name}</div>
          <div>
            ⭐ {star} | 받은 의뢰 수 {num}
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
          <h1>추천 서비스</h1>
          <form className={styles.search} action="/search" method="get" style={{marginBottom:"20px"}}>
                <input type="text" name="q" placeholder="유저 이름" value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                <button type="submit"></button>
          </form>
        </div>
        <div className={styles.filter}>
          <div style={{display: "flex", gap: "10px"}}>
            <div ref={dropdownGameRef} style={{position: "relative"}}>
              <button type="button"  onClick={(e) =>{e.stopPropagation(); setShowGame((prev) => !prev);}}>게임 종류</button>
              <ul className={showGame ? styles.show : ""} style={{width:"150px"}}>
                <li>리그오브레전드</li>
                <li>배틀 그라운드</li>
                <li>전략적 팀 전투</li>
              </ul>
            </div>

            <div ref={dropdownRankRef} style={{position: "relative"}}>
              <button type="button" onClick={(e) =>{e.stopPropagation(); setShowRank((prev) => !prev);}}>티어/랭크</button>
              <ul className={showRank ? styles.show : ""} style={{width:"80px"}}>
                <li>티어</li>
                <li>랭크</li>
              </ul>
            </div>
            <div ref={dropdownPriceRef} style={{position: "relative"}}>
              <button type="button" onClick={(e) =>{e.stopPropagation(); setShowPrice((prev) => !prev);}}>가격</button>
              <ul className={showPrice ? styles.show : ""} style={{width:"100px"}}>
                <li>최고 가격</li>
                <li>최소 가격</li>
              </ul>
            </div>
            <div ref={dropdownGenderRef} style={{position: "relative"}}>
              <button type="button" onClick={(e) =>{e.stopPropagation(); setShowGender((prev) => !prev);}}>성별</button>
              <ul className={showGender ? styles.show : ""}style={{width:"80px"}}>
                <li>남성</li>
                <li>여성</li>
              </ul>
            </div>
          </div>
          <div ref={dropdownOrderRef} style={{position: "relative"}}>
            <button type="button" style={{marginLeft: "10px"}} onClick={(e) =>{e.stopPropagation(); setShowOrder((prev) => !prev);}}>추천순</button>
            <ul className={showOrder ? styles.show : ""} style={{width:"80px"}}>
                <li>추천순</li>
                <li>최신순</li>
              </ul>
          </div>
        </div>

        <div style={{display:"flex", marginTop: "30px", flexWrap:"wrap", gap:"40px"}}>
          {user.map((item, index)=>(
              <Usercard index={index} img={item} name={`User ${index + 1}`} star="5.00" num="10" price="12"/>
            ))}
        </div>
      </div>
    </div>
    
  )
}
export default Search