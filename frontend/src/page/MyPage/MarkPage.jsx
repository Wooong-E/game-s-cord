import styles from "./MarkPage.module.css"
import Sidebar from "./Sidebar"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import logo_img from "../../assets/logo_profile.png";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MarkPage(){
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
                navigate("/login");
                return;
            }
            try {
                const res = await api.get('/marks');
                setUsers(res.data.map(u => ({
                    ...u,
                    isFavorite: u.isFavorite ?? true // 서버에서 값이 없으면 기본 true
                })));
                console.log(res.data);
            } catch (e) {
                console.error("즐겨찾기 결과 불러오기 실패:", e);
            }
        };
        
        fetchUsers();
    }, []);

    const toggleFavorite = async (id, currentFav) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인을 다시 해 주세요.");
            navigate("/login");
            return;
        }

        try {
            let response;

            if (currentFav) {
                response = await api.delete(`/marks/${id}`);
            } else {
                response = await api.post(`/marks/${id}`, {});
            }

            console.log(response.data);

            setUsers(prev => prev.map(u =>
                u.markedUserId === id ? { ...u, isFavorite: !currentFav } : u
            ));
        } catch (err) {
            console.error("즐겨찾기 변경 실패:", err);
        }
    };

    const UserComponent = ({name, id, img, isFavorite}) => {
        const navigate = useNavigate();
        const handleUserClick = () => {
            navigate("/")
        };
        const handleStarClick = (e) => {
            e.stopPropagation(); // 사용자 박스 클릭 이벤트 전파 막기
            toggleFavorite(id, isFavorite);
        };
        return (
          <div className={styles.userBox} onClick={handleUserClick}>
            <div className={styles.userSection}>
                <img src={
                !img || img === null || img === undefined || img.startsWith("http://example.com/")
                ? logo_img
                : img
                } alt="profile" className={styles.userImg}></img>
                <div className={styles.userName}>{name}</div>
            </div>
            <div className={styles.userSection}>
                <div className={styles.userId}>ID : {id}</div>

                <FontAwesomeIcon 
                icon={faStar} 
                className={isFavorite ? styles.activeStar : styles.star}
                onClick={handleStarClick}
                />
            </div>
          </div>
        );
      };

    return(
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.section}>
                <h1>즐겨찾기</h1>
                
                <div className={styles.userContainer}>
                    {(users || []).map((item, index) => (
                        <UserComponent key={index} index={index} id={item.markedUserId} name={item.markedUserName} img={item.markedUserProfileImageUrl} isFavorite={item.isFavorite}/>
                    ))}
                </div>
            </div>
        </div>
    )
} export default MarkPage