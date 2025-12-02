import styles from "./MyPage.module.css"
import Sidebar from "./Sidebar"
import defaultImg from "../../assets/user2.png"
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";


function MyPage(){
    const [modify, setModify] = useState(false);
    const [user, setUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [errors, setErrors] = useState({
        usersName: "",
        usersDescription: "",
        usersBirthday: "",
        gender: "",
        profileImageFile: ""
    });
    const [profilePreview, setProfilePreview] = useState(null);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {
            usersName: "",
            usersDescription: "",
            usersBirthday: "",
            gender: "",
            profileImageFile: ""
        };
        let isValid = true;

        if (!updatedUser.usersName || updatedUser.usersName.trim() === "") {
            newErrors.usersName = "닉네임은 필수입니다.";
            isValid = false;
        } else if ((updatedUser.usersName || "").length > 10) {
            newErrors.usersName = "사용자 이름은 10자 이하여야 합니다.";
            isValid = false;
        }
        if ((updatedUser.usersDescription || "").length > 255) {
            newErrors.usersDescription = "자기소개는 255자 이하여야 합니다.";
            isValid = false;
        }
        if (!updatedUser.usersBirthday) {
            newErrors.usersBirthday = "생년월일은 필수입니다.";
            isValid = false;
        } else if (!validateBirth(updatedUser.usersBirthday)) {
            newErrors.usersBirthday = "YYYY-MM-DD 형식으로 입력해 주세요.";
            isValid = false;
        } else if (new Date(updatedUser.usersBirthday) > new Date()) {
            newErrors.usersBirthday = "생년월일은 과거 날짜여야 합니다.";
            isValid = false;
        }
        if ((updatedUser.gender || "").length > 10) {
            newErrors.gender = "성별은 10자 이하여야 합니다.";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        fetchResults();
    },[]);

    const fetchResults = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
            navigate("/login");
            return;
        }
        try {
            const res = await api.get('/users/me', {
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

    const PatchResults = async () => {
        if (!validate()) return;
        const token = localStorage.getItem('accessToken');
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

            const res = await api.patch('/users/me',
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
            alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
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
                                style={{ width: "200px", maxHeight:"200px", borderRadius: "10px" }}
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
                        {modify ? <>
                            <input type="text" value={updatedUser.usersName || ""} className={styles.inputStyle} 
                                onChange={(e) => setUpdatedUser({ ...updatedUser, usersName: e.target.value })}></input> 
                            {errors.usersName && <div className={styles.errorText}>{errors.usersName}</div>} 
                            </> :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.usersName}</div>}

                        <div className={styles.title} style={{marginTop:"50px"}}>성별</div>
                        {modify ? <>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div className={`${styles.genderBox} ${styles.female} ${updatedUser.gender === "여" ? styles.selected : ""}`}
                                    onClick={() => setUpdatedUser({ ...updatedUser, gender: "여" })}
                                    >
                                <span className={styles.genderIcon}>♀</span> 여성 </div>
                                <div className={`${styles.genderBox} ${updatedUser.gender === "남" ? styles.selected : ""}`}
                                onClick={() => setUpdatedUser({ ...updatedUser, gender: "남" })} >
                                <span className={styles.genderIcon}>♂</span> 남성 </div>
                            </div> 
                            {errors.gender && <div className={styles.errorText}>{errors.gender}</div>}
                            </> :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.gender}</div>}

                        <div className={styles.title} style={{marginTop:"50px"}}>생년월일</div>
                        {modify ? <> <input type="text" value={updatedUser.usersBirthday || ""} className={styles.inputStyle} placeholder="YYYY-MM-DD"
                            onChange={(e) => {const value = e.target.value; setUpdatedUser({ ...updatedUser, usersBirthday: value }) }}/> 
                                {errors.usersBirthday && <div className={styles.errorText}>{errors.usersBirthday}</div>} </> :
                            <div className={styles.data} style={{marginBottom:"50px"}}>{user.usersBirthday}</div>}

                        <div className={styles.title} style={{marginTop:"50px"}}>자기소개</div>
                        {modify ? 
                            <>
                            <textarea  value={updatedUser.usersDescription || ""} className={styles.textareaStyle} 
                            onChange={(e) => setUpdatedUser({ ...updatedUser, usersDescription: e.target.value })}/>
                            {errors.usersDescription && <div className={styles.errorText}>{errors.usersDescription}</div>} 
                            </> :
                            <div className={styles.data}>{user.usersDescription}</div>}
                    </div>
                </form>
            </div>
        </div>
    )
} 
export default MyPage