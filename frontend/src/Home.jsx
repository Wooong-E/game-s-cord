import styles from "./Home.module.css";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeagueofLeagends from "./assets/LeaguofLeagends.jpg"
import Battleground from "./assets/Battleground.jpg"
import Teamfight from "./assets/Teamfight.jpg"
import user1 from "./assets/user1.png"
import user2 from "./assets/user2.png"
import user3 from "./assets/user3.png"
import user4 from "./assets/user4.png"
import user5 from "./assets/user5.png"
import user6 from "./assets/user6.png"
import user7 from "./assets/user7.png"

import { useState, useRef, useEffect } from "react";

function useScroll(ref, scrollAmount){
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const handleScroll = () => {
    const box = ref.current;
    setCanScrollPrev(box.scrollLeft > 0);
    setCanScrollNext(box.scrollLeft < box.scrollWidth - box.clientWidth - 1); // 1px 여유
  };

  const scrollNext = () => {
    ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollPrev = () => {
    ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const box = ref.current;
    box.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 상태 설정
    return () => box.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return { canScrollPrev, canScrollNext, scrollNext, scrollPrev };
}

function Home() {
  const gameList = ["LeagueofLeagends", "Battleground", "Teamfight"];
  const games = {
    LeagueofLeagends: LeagueofLeagends,
    Battleground: Battleground,
    Teamfight: Teamfight
  };
  const user = [user1, user2, user3, user4, user5, user6, user7];
  const gameBoxRef = useRef(null);
  const userBoxRef = useRef(null);
 
  const gameScroll = useScroll(gameBoxRef, 340);
  const userScroll = useScroll(userBoxRef, 440);
  

  const GameComponent=({game})=>{
    return(
      <div className={styles.game}>
        <img src={games[game]} />
      </div>
    )
  }

  const UserComponent=({index})=>{
    return(
      <div className={styles.user}>
        <div className={styles.imgbox}>
          <img src={user[index]} />
          <div className={styles.biobox}>
            <div style={{fontSize: "22px", fontWeight: "bold"}}>User {index+1}</div>
            <div>Bio</div>
            <div>Game</div>
            <div>money/hours</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h1>추천 서비스</h1>
        <div className={styles.visible_gamebox} ref={gameBoxRef}>
          <div className={styles.gamebox}>
            {gameList.map((item, index)=>(
              <GameComponent key={index} game={item}></GameComponent>
            ))}
          </div>
        </div>
      </div>


      <div className={styles.section}>
        <h1>추천 유저</h1>
        <button onClick={() => {userScroll.scrollPrev()}} className={!userScroll.canScrollPrev ? styles.hidden : styles.prev}>
            <FontAwesomeIcon icon={faCircleChevronLeft} /></button>
        <button onClick={() => {userScroll.scrollNext()}} className={!userScroll.canScrollNext? styles.hidden : styles.next}>
          <FontAwesomeIcon icon={faCircleChevronRight} /></button>
        <div className={styles.visible_userbox} ref={userBoxRef}>
          <div className={styles.userbox}>
            {user.map((item, index)=>(
              <UserComponent index={index} ></UserComponent>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home
