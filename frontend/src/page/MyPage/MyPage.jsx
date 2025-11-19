import styles from "./MyPage.module.css"
import Sidebar from "./Sidebar"
import user2 from "../../assets/user2.png"
import { useState, useEffect } from "react";
import axios from "axios";


function MyPage(){
    const [modify, setModify] = useState(false);
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [birthError, setBirthError] = useState("");

    const fetchResults = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인을 먼저 하세요.");
            return;
        }
        try {
            const res = await axios.get('/api/users/profile', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            setUpdatedUser(res.data);
            console.log(res.data);
        } catch (e) {
            console.error("검색 결과 불러오기 실패:", e);
        }
    };

    //API Get 요청
    useEffect(() => {
        fetchResults();
    }, []);

    const PatchResults = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.warn("로그인을 먼저 하세요.");
            return;
        }
        if (!validateBirth(updatedUser.usersBirthday)) {
            setBirthError("YYYY-MM-DD 형식으로 입력해 주세요.");
            return; // 저장 중단
        }
        setBirthError("");

        try {
            const res = await axios.patch('/api/users/profile', updatedUser,{
                headers: { Authorization: `Bearer ${token}`},
            });
            setUser(res.data);
            setModify(false);
            console.log(res.data);
        } catch (e) {
            console.error("검색 결과 불러오기 실패:", e);
        }
    }

    const validateBirth = (date) => {
        // YYYY-MM-DD 형식 체크
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    };

    return(
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.section}>
                <h1>마이페이지</h1>

                <form style={{display: "flex", marginLeft:"80px"}} onSubmit={(e) => e.preventDefault()}>
                    <div style={{margin: "0px 50px", display:"flex", flexDirection:"column"}}>
                        <div className={styles.imgbox}>
                            <img src={user2} style={{width:"200px"}}></img>
                        </div>

                        {modify ? <button type="submit" className={`${styles.modify} ${styles.click}`} onClick={PatchResults}>저장하기</button> :
                            <div className={styles.modify} onClick={()=>setModify(true)}>프로필 수정하기</div>}
                    </div>

                    <div style={{display: "flex", flexDirection: "column", marginLeft: "100px"}}>
                        <div className={styles.title}>닉네임</div>
                        {modify ? <input type="text" value={updatedUser.usersName || ""} className={styles.inputStyle} 
                            onChange={(e) => setUpdatedUser({ ...updatedUser, usersName: e.target.value })}></input>:
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.usersName}</div>}

                        <div className={styles.title}>성별</div>
                        {modify ? 
                            <div style={{ display: "flex", gap: "20px", marginBottom: "50px" }}>
                                <div className={`${styles.genderBox} ${styles.female} ${updatedUser.gender === "여성" ? styles.selected : ""}`}
                                    onClick={() => setUpdatedUser({ ...updatedUser, gender: "여성" })}
                                    >
                                <span className={styles.genderIcon}>♀</span> 여성 </div>
                                <div className={`${styles.genderBox} ${updatedUser.gender === "남성" ? styles.selected : ""}`}
                                onClick={() => setUpdatedUser({ ...updatedUser, gender: "남성" })} >
                                <span className={styles.genderIcon}>♂</span> 남성 </div>
                            </div> :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.gender}</div>}

                        <div className={styles.title}>생년월일</div>
                        {modify ? (<> <input type="text" value={updatedUser.usersBirthday || ""} className={styles.inputStyle} placeholder="YYYY-MM-DD"
                            onChange={(e) => {const value = e.target.value; setUpdatedUser({ ...updatedUser, usersBirthday: value }) }}/> 
                                {birthError && <div className={styles.errorText}>{birthError}</div>} </>) :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.usersBirthday}</div>}

                        <div className={styles.title}>자기소개</div>
                        {modify ? <textarea  value={updatedUser.bio || ""} className={styles.textareaStyle} 
                            onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}/>:
                            <div className={styles.data}>{user.bio}</div>}
                    </div>
                </form>
            </div>
        </div>
    )
} 
export default MyPage