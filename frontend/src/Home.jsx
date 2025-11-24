import styles from "./Home.module.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import LeagueofLeagends from "./assets/LeaguofLeagends.jpg";
import Battleground from "./assets/Battleground.jpg";
import overwatch from "./assets/overwatch.jpg";
import user1 from "./assets/user1.png";
import user2 from "./assets/user2.png";
import user3 from "./assets/user3.png";
import user4 from "./assets/user4.png";
import user5 from "./assets/user5.png";
import user6 from "./assets/user6.png";
import user7 from "./assets/user7.png";
import coin from "./assets/coin.jpg";

function useScroll(ref, scrollAmount) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const handleScroll = () => {
    const box = ref.current;
    setCanScrollPrev(box.scrollLeft > 0);
    setCanScrollNext(box.scrollLeft < box.scrollWidth - box.clientWidth - 1);
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
    handleScroll();
    return () => box.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return { canScrollPrev, canScrollNext, scrollNext, scrollPrev };
}

function Home() {
  const gameList = ["LeagueofLeagends", "Battleground", "Overwatch"];
  const games = {
    LeagueofLeagends: LeagueofLeagends,
    Battleground: Battleground,
    Overwatch: overwatch,
  };
  const [lolUsers, setLolUsers] = useState([]);
  const [bgUsers, setBgUsers] = useState([]);
  const [owUsers, setOwUsers] = useState([]);

  const userImages = [user1, user2, user3, user4, user5, user6, user7];

  const [users, setUsers] = useState([]);
  const gameBoxRef = useRef(null);
  const userBoxRef = useRef(null);

  const gameScroll = useScroll(gameBoxRef, 340);
  const userScroll = useScroll(userBoxRef, 440);
  const navigate = useNavigate();

  const gameIdMap = {
    LeagueofLeagends: 1,
    Battleground: 2,
    Overwatch: 3,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const lol = await axios.get("/api/gamemates/popular/1");
        const bg = await axios.get("/api/gamemates/popular/2");
        const ow = await axios.get("/api/gamemates/popular/3");

        setLolUsers(lol.data);
        setBgUsers(bg.data);
        setOwUsers(ow.data);
      } catch (e) {
        console.error("추천 유저 조회 실패:", e);
      }
    };

    fetchUsers();
  }, []);

  const GameComponent = ({ game }) => {
    return (
      <div
        className={styles.game}
        onClick={() => navigate("/search", { state: { gameId: gameIdMap[game] } })}
        style={{ cursor: "pointer" }}
      >
        <img src={games[game]} />
      </div>
    );
  };

  const UserComponent = ({ index,userId,name, tier, game, price }) => {
    return (
      <div
        className={styles.user}
        onClick={() => navigate("/matchdetail", { state: { userId } })}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.imgbox}>
          <img src={userImages[index]} />
          <div className={styles.biobox}>
            <div style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px", marginTop: "-5px" }}>{name}</div>
            <div style={{ marginBottom: "2px" }}>{game}</div>
            <div style={{ marginBottom: "5px", fontSize: "15px" }}>Level : {tier}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img src={coin} style={{ width: "20px", height: "20px", marginLeft: "0", marginTop: "3px" }} />
              <div style={{ color: "#f1a100ff" }}>{price}/판</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h1>추천 서비스</h1>
        <div className={styles.visible_gamebox} ref={gameBoxRef}>
          <div className={styles.gamebox}>
            {gameList.map((item, index) => (
              <GameComponent key={index} game={item} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h1>리그 오브 레전드</h1>

        <button
          onClick={() => userScroll.scrollPrev()}
          className={!userScroll.canScrollPrev ? styles.hidden : styles.prev}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => userScroll.scrollNext()}
          className={!userScroll.canScrollNext ? styles.hidden : styles.next}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={userBoxRef}>
          <div className={styles.userbox}>
            {lolUsers.map((item, index) => (
              <UserComponent
                key={index}
                index={index}
                userId={item.userId}
                name={item.userName}
                tier={item.tier}
                game={item.gameName}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h1>배틀 그라운드</h1>

        <button
          onClick={() => userScroll.scrollPrev()}
          className={!userScroll.canScrollPrev ? styles.hidden : styles.prev}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => userScroll.scrollNext()}
          className={!userScroll.canScrollNext ? styles.hidden : styles.next}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={userBoxRef}>
          <div className={styles.userbox}>
            {bgUsers.map((item, index) => (
              <UserComponent
                key={index}
                index={index}
                userId={item.userId}
                name={item.userName}
                tier={item.tier}
                game={item.gameName}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h1>오버워치</h1>

        <button
          onClick={() => userScroll.scrollPrev()}
          className={!userScroll.canScrollPrev ? styles.hidden : styles.prev}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => userScroll.scrollNext()}
          className={!userScroll.canScrollNext ? styles.hidden : styles.next}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={userBoxRef}>
          <div className={styles.userbox}>
            {owUsers.map((item, index) => (
              <UserComponent
                key={index}
                index={index}
                userId={item.userId}
                name={item.userName}
                tier={item.tier}
                game={item.gameName}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;