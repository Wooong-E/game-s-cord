import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css"

function Sidebar(){
    const location = useLocation();
    
    return (
        <div className={styles.outer}>
            <Link to="/Mypage" className={`${styles.link} ${location.pathname === "/Mypage" ? styles.active : ""}`}>
                <div>마이페이지</div>
            </Link>
            <Link to="/" className={`${styles.link} ${location.pathname === "/" ? styles.active : ""}`}>
                <div>신청내역</div>
            </Link>
            <Link to="/" className={`${styles.link} ${location.pathname === "/" ? styles.active : ""}`}>
                <div>결제 및 충전</div>
            </Link>
        </div>
    )
}
export default Sidebar;