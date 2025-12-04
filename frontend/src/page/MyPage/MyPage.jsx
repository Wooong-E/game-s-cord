import styles from "./MyPage.module.css";
import Sidebar from "./Sidebar";
import defaultImg from "../../assets/logo_profile.png";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MyPage() {
  const [modify, setModify] = useState(false);
  const [user, setUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const [errors, setErrors] = useState({
    usersName: "",
    usersDescription: "",
    usersBirthday: "",
    gender: "",
    profileImageFile: "",
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {
      usersName: "",
      usersDescription: "",
      usersBirthday: "",
      gender: "",
      profileImageFile: "",
    };
    let isValid = true;

    if (!updatedUser.usersName || updatedUser.usersName.trim() === "") {
      newErrors.usersName = "닉네임은 필수입니다.";
      isValid = false;
    } else if ((updatedUser.usersName || "").length > 10) {
      newErrors.usersName = "사용자 이름은 10자 이하여야 합니다.";
      isValid = false;
    }
    const desc = (updatedUser.usersDescription || "").trim();
    if (!desc || desc.length < 10) {
      newErrors.usersDescription = "자기소개는 최소 10자 이상 입력해 주세요.";
      isValid = false;
    } else if (desc.length > 255) {
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
  }, []);

  const fetchResults = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      navigate("/login");
      return;
    }
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setUpdatedUser(res.data);
      setProfilePreview(res.data.profileImageUrl || null);
      console.log(res.data);
    } catch (e) {
      console.error("검색 결과 불러오기 실패:", e);
    } finally {
      setIsLoaded(true);
    }
  };

  const PatchResults = async () => {
    if (!validate()) return;
    const token = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();

      const data = {
        usersName: updatedUser.usersName,
        gender: updatedUser.gender,
        usersBirthday: updatedUser.usersBirthday,
        usersDescription: updatedUser.usersDescription,
      };

      formData.append("data", JSON.stringify(data));
      if (updatedUser.profileImageFile) {
        formData.append("image", updatedUser.profileImageFile);
      }

      const res = await api.patch("/users/me", formData);

      setUser(res.data);
      setProfilePreview(res.data.profileImageUrl);
      setModify(false);
    } catch (e) {
      console.error("프로필 수정 실패:", e);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

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

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.section}>
        <h1>마이페이지</h1>

        <form
          style={{ display: "flex", marginLeft: "80px" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            style={{
              margin: "0px 50px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className={styles.imgbox}>
              {!isLoaded && (
                // 로딩 중: 회색 박스 스켈레톤
                <div
                  style={{
                    width: "240px",
                    height: "240px",
                    borderRadius: "20px",
                    background: "#f0f0f0",
                  }}
                />
              )}
              {isLoaded && ( <img
                src={
                  !profilePreview
                    ? defaultImg
                    : profilePreview.startsWith("http://example.com/")
                    ? defaultImg
                    : encodeURI(profilePreview)
                }
                className={modify ? styles.imgDark : ""}
                style={{
                  width: "240px",
                  height: "240px",
                  objectFit: "cover",
                  objectPosition:"center",
                  borderRadius:"20px",
                }}
                alt="profile"
              /> )}
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {modify && (
                <FontAwesomeIcon
                  icon={faCamera}
                  className={styles.cameraIcon}
                  onClick={() =>
                    document.getElementById("profileUpload").click()
                  }
                />
              )}
            </div>

            {modify ? (
              <button
                type="submit"
                className={`${styles.modify} ${styles.click}`}
                onClick={PatchResults}
              >
                저장하기
              </button>
            ) : (
              <div
                className={styles.modify}
                onClick={() => {
                  setModify(true);
                }}
              >
                프로필 수정하기
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "100px",
            }}
          >
            <div className={styles.title}>닉네임</div>
            {modify ? (
              <>
                <input
                  type="text"
                  value={updatedUser.usersName || ""}
                  className={styles.inputStyle}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      usersName: e.target.value,
                    })
                  }
                ></input>
                {errors.usersName && (
                  <div className={styles.errorText}>{errors.usersName}</div>
                )}
              </>
            ) : (
              <div className={styles.readonlyBox}>
                {user.usersName || "닉네임을 등록해주세요"}
              </div>
            )}

            <div className={styles.title} style={{ marginTop: "50px" }}>
              성별
            </div>
            {modify ? (
              <>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    className={`${styles.genderBox} ${styles.female} ${
                      updatedUser.gender === "여" ? styles.selected : ""
                    }`}
                    onClick={() =>
                      setUpdatedUser({ ...updatedUser, gender: "여" })
                    }
                  >
                    <span className={styles.genderIcon}>♀</span> 여성{" "}
                  </div>
                  <div
                    className={`${styles.genderBox} ${
                      updatedUser.gender === "남" ? styles.selected : ""
                    }`}
                    onClick={() =>
                      setUpdatedUser({ ...updatedUser, gender: "남" })
                    }
                  >
                    <span className={styles.genderIcon}>♂</span> 남성{" "}
                  </div>
                </div>
                {errors.gender && (
                  <div className={styles.errorText}>{errors.gender}</div>
                )}
              </>
            ) : (
              <div className={`${styles.readonlyBox} ${
                (!user.gender || user.gender === "None") ? styles.placeholder : ""
              }`} >
                {user.gender && user.gender !== "None" ? user.gender : "성별을 선택해주세요."}
              </div>
            )}

            <div className={styles.title} style={{ marginTop: "50px" }}>
              생년월일
            </div>
            {modify ? (
              <>
                {" "}
                <input
                  type="text"
                  value={updatedUser.usersBirthday || ""}
                  className={styles.inputStyle}
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => {
                    const value = e.target.value;
                    setUpdatedUser({ ...updatedUser, usersBirthday: value });
                  }}
                />
                {errors.usersBirthday && (
                  <div className={styles.errorText}>{errors.usersBirthday}</div>
                )}{" "}
              </>
            ) : (
              <div className={`${styles.readonlyBox} ${
                !user.usersBirthday ? styles.placeholder : ""
              }`}>
                {user.usersBirthday||"생년월일을 등록해주세요."}
              </div>
            )}

            <div className={styles.title} style={{ marginTop: "50px" }}>
              자기소개
            </div>
            {modify ? (
              <>
                <textarea
                  value={updatedUser.usersDescription || ""}
                  className={styles.textareaStyle}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      usersDescription: e.target.value,
                    })
                  }
                />
                {errors.usersDescription && (
                  <div className={styles.errorText}>
                    {errors.usersDescription}
                  </div>
                )}
              </>
            ) : (
              <div className={`${styles.readonlyTextarea} ${
                !user.usersDescription ? styles.placeholder : ""
              }`}>
                {user.usersDescription || "자기소개를 입력해주세요."}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default MyPage;
