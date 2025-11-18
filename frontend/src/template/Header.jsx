import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import styles from "./Header.module.css";
import coin from "../assets/coin.jpg";

const Header = () => {
  const [query, setQuery] = useState("");
  const [search, setsearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(setQuery.trim() !== ""){
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearch(false);
      setQuery("");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <Link className={styles.link} to="/" onClick={()=>setsearch(false)}>Logo</Link>
        <Link className={styles.link} to="/search">서비스</Link>
      </div>
      <div className={styles.section}>
        {location.pathname !== "/search" && ( <form className={search ? `${styles.search}` : `${styles.search} ${styles.hidden}`} action="/search" method="get">
              <input type="text" name="q" placeholder="유저 이름" value={query} onChange={(e) => setQuery(e.target.value)}/>
              <button type="submit" onClick={()=>setsearch(!search)}></button>
        </form>)}
        {location.pathname !== "/search" && ( <FontAwesomeIcon className={search ? `${styles.hidden} ${styles.searchicon}` : `${styles.searchicon}`} onClick={()=>setsearch(!search)} icon={faMagnifyingGlass} style={{fontSize:"1.1rem"}} /> )}
        <Link className={styles.link} to="/">
          <img src={coin} alt="coin" className={styles.coin}></img>
          <span>충전</span>
        </Link>
        <Link className={`${styles.link} ${styles.login}`} to="/">
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
