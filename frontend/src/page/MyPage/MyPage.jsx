import styles from "./MyPage.module.css"
import Sidebar from "./Sidebar"
import defaultImg from "../../assets/user2.png"
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import axios from "axios";


function MyPage(){
    const [modify, setModify] = useState(false);
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [birthError, setBirthError] = useState("");
    const [profilePreview, setProfilePreview] = useState(null);

    const fetchResults = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인을 먼저 하세요.");
            return;
        }
        try {
            const res = await axios.get('/api/users/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            setUpdatedUser(res.data);
            setProfilePreview(res.data.profileImageUrl || null);
            console.log(res.data);
        } catch (e) {
            console.error("검색 결과 불러오기 실패:", e);
        }
    };

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

            const formData = new FormData();

            // 이미지 파일
            if (updatedUser.profileImageFile) {
                formData.append("profileImage", updatedUser.profileImageFile);
            }

            formData.append("usersName", updatedUser.usersName);
            formData.append("gender", updatedUser.gender);
            formData.append("usersBirthday", updatedUser.usersBirthday);
            formData.append("usersDescription", updatedUser.usersDescription);

            const res = await axios.patch('/api/users/me',
                formData,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                    }
                }
            );
            setUser(res.data);
            setProfilePreview(res.data.profileImageUrl);
            setModify(false);
            console.log(res.data);
        } catch (e) {
            console.error("검색 결과 불러오기 실패:", e);
        }
    }

    //이미지 미리보기
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedUser({ ...updatedUser, profileImageFile: file }); // 파일 저장
            setProfilePreview(URL.createObjectURL(file)); // 미리보기
        }
    };

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
                            <img
                                src={profilePreview || defaultImg}
                                className={modify ? styles.imgDark : ""}
                                style={{ width: "200px", borderRadius: "10px" }}
                                alt="profile"
                            />
                            <input
                                    id="profileUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none"}}
                            />
                            {modify && (
                                <FontAwesomeIcon 
                                icon={faCamera}
                                className={styles.cameraIcon}
                                onClick={() => document.getElementById("profileUpload").click()}
                                />
                            )}
                        </div>

                        {modify ? <button type="submit" className={`${styles.modify} ${styles.click}`} onClick={PatchResults}>저장하기</button> :
                            <div className={styles.modify} onClick={()=>{setModify(true)}}>프로필 수정하기</div>}
                    </div>

                    <div style={{display: "flex", flexDirection: "column", marginLeft: "100px"}}>
                        <div className={styles.title}>닉네임</div>
                        {modify ? <input type="text" value={updatedUser.usersName || ""} className={styles.inputStyle} 
                            onChange={(e) => setUpdatedUser({ ...updatedUser, usersName: e.target.value })}></input>:
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.usersName}</div>}

                        <div className={styles.title}>성별</div>
                        {modify ? 
                            <div style={{ display: "flex", gap: "20px", marginBottom: "50px" }}>
                                <div className={`${styles.genderBox} ${styles.female} ${updatedUser.gender === "여" ? styles.selected : ""}`}
                                    onClick={() => setUpdatedUser({ ...updatedUser, gender: "여" })}
                                    >
                                <span className={styles.genderIcon}>♀</span> 여성 </div>
                                <div className={`${styles.genderBox} ${updatedUser.gender === "남" ? styles.selected : ""}`}
                                onClick={() => setUpdatedUser({ ...updatedUser, gender: "남" })} >
                                <span className={styles.genderIcon}>♂</span> 남성 </div>
                            </div> :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.gender}</div>}

                        <div className={styles.title}>생년월일</div>
                        {modify ? (<> <input type="text" value={updatedUser.usersBirthday || ""} className={styles.inputStyle} placeholder="YYYY-MM-DD"
                            onChange={(e) => {const value = e.target.value; setUpdatedUser({ ...updatedUser, usersBirthday: value }) }}/> 
                                {birthError && <div className={styles.errorText}>{birthError}</div>} </>) :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.usersBirthday}</div>}

                        <div className={styles.title}>자기소개</div>
                        {modify ? <textarea  value={updatedUser.usersDescription || ""} className={styles.textareaStyle} 
                            onChange={(e) => setUpdatedUser({ ...updatedUser, usersDescription: e.target.value })}/>:
                            <div className={styles.data}>{user.usersDescription}</div>}
                    </div>
                </form>
            </div>
        </div>
    )
} 
export default MyPage