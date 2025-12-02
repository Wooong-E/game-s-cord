import styles from "./Home.module.css";
import { useState, useRef, useEffect } from "react";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import LeagueofLeagends from "./assets/LeaguofLeagends.jpg";
import Battleground from "./assets/Battleground.jpg";
import overwatch from "./assets/Overwatch.jpg";
import user1 from "./assets/user1.png";
import user2 from "./assets/user2.png";
import user3 from "./assets/user3.png";
import user4 from "./assets/user4.png";
import user5 from "./assets/user5.png";
import user6 from "./assets/user6.png";
import user7 from "./assets/user7.png";
import user8 from "./assets/user8.png";
import user9 from "./assets/user9.png";
import user10 from "./assets/user10.png";
import user11 from "./assets/user11.png";
import user12 from "./assets/user12.png";
import user13 from "./assets/user13.png";
import user14 from "./assets/user14.png";
import user15 from "./assets/user15.png";
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

  const userImages = [
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
    user11,
    user12,
    user13,
    user14,
    user15,
  ];

  const [users, setUsers] = useState([]);
  const gameBoxRef = useRef(null);

  // Ref 중복 사용 문제 해결: 각 사용자 박스에 고유한 Ref를 할당
  const lolUserBoxRef = useRef(null);
  const bgUserBoxRef = useRef(null);
  const owUserBoxRef = useRef(null);

  const gameScroll = useScroll(gameBoxRef, 340);

  // 각 섹션에 고유한 스크롤 훅을 적용
  const lolUserScroll = useScroll(lolUserBoxRef, 440);
  const bgUserScroll = useScroll(bgUserBoxRef, 440);
  const owUserScroll = useScroll(owUserBoxRef, 440);

  // 무한 배너
  const rawBanners = [banner1, banner2, banner3];
  const banners = [
    rawBanners[rawBanners.length - 1],
    ...rawBanners,
    rawBanners[0],
  ];
  const [index, setIndex] = useState(1); // 복제구간 때문에 실제 시작은 1
  const [transition, setTransition] = useState(true);

  const navigate = useNavigate();

  const gameIdMap = {
    LeagueofLeagends: 1,
    Battleground: 2,
    Overwatch: 3,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const lol = await api.get("/gamemates/popular/1");
        const bg = await api.get("/gamemates/popular/2");
        const ow = await api.get("/gamemates/popular/3");

        // API 응답 데이터가 배열인지 확인하고 설정, 배열이 아니면 빈 배열로 설정
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

  // 자동 슬라이드 5S
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
      // 마지막 복제 노드 → 실제 첫 번째로 순간 이동
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 600);
    }

    if (index === 0) {
      // 첫 번째 복제 노드 → 실제 마지막으로 순간 이동
      setTimeout(() => {
        setTransition(false);
        setIndex(banners.length - 2);
      }, 600);
    }
  }, [index]);

  const goDot = (target) => {
    setIndex(target + 1); // 실제 index 보정
    setTransition(true);
  };

  const GameComponent = ({ game }) => {
    return (
      <div
        className={styles.game}
        onClick={() =>
          navigate("/search", { state: { gameId: gameIdMap[game] } })
        }
        style={{ cursor: "pointer" }}
      >
        <img src={games[game]} />
      </div>
    );
  };

  const UserComponent = ({ index, userId, name, tier, game, price }) => {
    return (
      <div
        className={styles.user}
        onClick={() => navigate("/matchdetail", { state: { userId } })}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.imgbox}>
          <img src={userImages[index % userImages.length]} />{" "}
          {/* 이미지 인덱스가 배열 크기를 초과하지 않도록 수정 */}
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
            <div style={{ marginBottom: "2px" }}>{game}</div>
            <div style={{ marginBottom: "5px", fontSize: "15px" }}>
              Level : {tier}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src={coin}
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "0",
                  marginTop: "3px",
                }}
              />
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
          onClick={() => lolUserScroll.scrollPrev()}
          className={!lolUserScroll.canScrollPrev ? styles.hidden : styles.prev}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => lolUserScroll.scrollNext()}
          className={!lolUserScroll.canScrollNext ? styles.hidden : styles.next}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={lolUserBoxRef}>
          <div className={styles.userbox}>
            {/* u.map 오류 해결: lolUsers가 null/undefined일 때 빈 배열로 대체 */}
            {(lolUsers || []).map((item, index) => (
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
          onClick={() => bgUserScroll.scrollPrev()}
          className={!bgUserScroll.canScrollPrev ? styles.hidden : styles.prev}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => bgUserScroll.scrollNext()}
          className={!bgUserScroll.canScrollNext ? styles.hidden : styles.next}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={bgUserBoxRef}>
          <div className={styles.userbox}>
            {/* u.map 오류 해결: bgUsers가 null/undefined일 때 빈 배열로 대체 */}
            {(bgUsers || []).map((item, index) => (
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
          onClick={() => owUserScroll.scrollPrev()}
          className={!owUserScroll.canScrollPrev ? styles.hidden : styles.prev}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <button
          onClick={() => owUserScroll.scrollNext()}
          className={!owUserScroll.canScrollNext ? styles.hidden : styles.next}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>

        <div className={styles.visible_userbox} ref={owUserBoxRef}>
          <div className={styles.userbox}>
            {/* u.map 오류 해결: owUsers가 null/undefined일 때 빈 배열로 대체 */}
            {(owUsers || []).map((item, index) => (
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
