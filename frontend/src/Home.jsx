import styles from "./Home.module.css";
import { useState, useRef, useEffect, memo } from "react";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import LeagueofLeagends from "./assets/LeaguofLeagends.jpg";
import Battleground from "./assets/Battleground.jpg";
import overwatch from "./assets/Overwatch.jpg";
import logo_img from "./assets/logo_profile.png";
import coin from "./assets/coin.jpg";
import banner1 from "./assets/banner1.png";
import banner2 from "./assets/banner2.png";
import banner3 from "./assets/banner3.png";

// 스크롤 로직을 담당하는 커스텀 훅
function useScroll(ref, scrollAmount) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const handleScroll = () => {
    const box = ref.current;
    if (!box) return;
    setCanScrollPrev(box.scrollLeft > 0);
    // 스크롤바가 끝까지 도달했는지 확인
    setCanScrollNext(box.scrollLeft < box.scrollWidth - box.clientWidth - 1);
  };

  const scrollNext = () => {
    if (ref.current) {
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (ref.current) {
      ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    box.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => box.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return { canScrollPrev, canScrollNext, scrollNext, scrollPrev };
}

function Banner({ rawBanners }) {
  // [마지막, 1,2,3, 첫번째] 형태로 양 끝에 복제
  const banners = [rawBanners[rawBanners.length - 1], ...rawBanners, rawBanners[0]];

  const [index, setIndex] = useState(1); // 실제 시작은 1
  const [transition, setTransition] = useState(true);

  // 자동 슬라이드 5초
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
      setTransition(true);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 무한 루프 처리
  useEffect(() => {
    if (index === banners.length - 1) {
      // 마지막(복제) → 첫 번째로 순간이동
      const t = setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 600);
      return () => clearTimeout(t);
    }

    if (index === 0) {
      // 첫 번째(복제) → 마지막으로 순간이동
      const t = setTimeout(() => {
        setTransition(false);
        setIndex(banners.length - 2);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [index, banners.length]);

  const goDot = (target) => {
    setIndex(target + 1); // 실제 index 보정
    setTransition(true);
  };

  return (
    <div className={styles.bannerWrapper}>
      <div
        className={styles.bannerSlideBox}
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: transition ? "transform 0.6s ease-in-out" : "none",
        }}
      >
        {banners.map((src, i) => (
          <img key={i} src={src} className={styles.bannerImage} />
        ))}
      </div>

      {/* Dot Navigation */}
      <div className={styles.bannerDots}>
        {rawBanners.map((_, i) => (
          <div
            key={i}
            className={i + 1 === index ? styles.dotActive : styles.dot}
            onClick={() => goDot(i)}
          />
        ))}
      </div>
    </div>
  );
}

function UserCard({ index, userId, name, tier, game, price, onClick, img }) {
  return (
    <div className={styles.user} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className={styles.imgbox}>
        <div style={{width: "150px", height: "140px", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <img src={!img
                    ? logo_img
                    : img.startsWith("http://example.com/")
                        ? logo_img
                        : encodeURI(img)} alt="user profile" />
        </div>
        <div className={styles.biobox}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "5px",
              marginTop: "-5px",
            }}
          >
            {name}
          </div>
          <div style={{ marginBottom: "2px" }}>{translateGameName(game)}</div>
          <div style={{ marginBottom: "5px", fontSize: "15px" }}>Level : {tier}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img
              src={coin}
              style={{ width: "20px", height: "20px", marginLeft: "0", marginTop: "3px" }}
              alt="coin"
            />
            <div style={{ color: "#f1a100ff" }}>{price}/판</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserList = memo(function UserList({ title, users }) {
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const scroll = useScroll(boxRef, 440);

  const handleUserClick = (userId) => {
    navigate("/matchdetail", { state: { userId } });
  };

  return (
    <div className={styles.section}>
      <h1>{title}</h1>

      <button
        onClick={scroll.scrollPrev}
        className={!scroll.canScrollPrev ? styles.hidden : styles.prev}
      >
        <FontAwesomeIcon icon={faCircleChevronLeft} />
      </button>

      <button
        onClick={scroll.scrollNext}
        className={!scroll.canScrollNext ? styles.hidden : styles.next}
      >
        <FontAwesomeIcon icon={faCircleChevronRight} />
      </button>

      <div className={styles.visible_userbox} ref={boxRef}>
        <div className={styles.userbox}>
          {(users || []).map((item, index) => (
            <UserCard
              key={item.userId ?? index}
              index={index}
              userId={item.userId}
              name={item.userName}
              tier={item.tier}
              game={item.gameName}
              price={item.price}
              img={item.profileImageUrl}
              onClick={() => handleUserClick(item.userId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

function translateGameName(game) {
  switch (game) {
    case "League of Legends":
      return "리그 오브 레전드";
    case "Battlegrounds":
      return "배틀 그라운드";
    case "Overwatch":
      return "오버워치";
    default:
      return game;
  }
}

function GameComponent({ game, image, gameId }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.game}
      onClick={() => navigate("/search", { state: { gameId } })}
      style={{ cursor: "pointer" }}
    >
      <img src={image} alt={game} />
    </div>
  );
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

  const gameBoxRef = useRef(null);

  const gameIdMap = {
    LeagueofLeagends: 1,
    Battleground: 2,
    Overwatch: 3,
  };

  // 추천 유저 API 호출
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const lol = await api.get("/gamemates/popular/1");
        const bg = await api.get("/gamemates/popular/2");
        const ow = await api.get("/gamemates/popular/3");

        setLolUsers(Array.isArray(lol.data) ? lol.data : []);
        setBgUsers(Array.isArray(bg.data) ? bg.data : []);
        setOwUsers(Array.isArray(ow.data) ? ow.data : []);

        console.log(lol.data);
        console.log(bg.data);
        console.log(ow.data);
      } catch (e) {
        console.error("추천 유저 조회 실패:", e);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        {/* 배너 분리 */}
        <Banner rawBanners={[banner1, banner2, banner3]} />

        <h1>추천 서비스</h1>
        <div className={styles.visible_gamebox} ref={gameBoxRef}>
          <div className={styles.gamebox}>
            {gameList.map((item, index) => (
              <GameComponent
                key={index}
                game={item}
                image={games[item]}
                gameId={gameIdMap[item]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 게임별 추천 유저 리스트 (memo 적용) */}
      <UserList title="리그 오브 레전드" users={lolUsers} />
      <UserList title="배틀 그라운드" users={bgUsers} />
      <UserList title="오버워치" users={owUsers} />
    </div>
  );
}

export default Home;