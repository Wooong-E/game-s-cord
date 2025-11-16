import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import coin from "../assets/coin.jpg";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <Link className={styles.link} to="/">
          Logo
        </Link>
        <Link className={styles.link} to="/">
          서비스
        </Link>
        <Link className={styles.link} to="/">
          커뮤니티
        </Link>
      </div>
      <div className={styles.section}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ fontSize: "1.1rem" }}
        />
        <Link className={styles.link} to="/coin">
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
