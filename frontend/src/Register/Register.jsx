import "../css/Register.css";
import { FaRegIdCard, FaUser } from "react-icons/fa";
import { PiLockKeyBold } from "react-icons/pi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoIosBarcode } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

//회원가입 컴포넌트
const Register = () => {
  // 상태
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState(""); // 생년월일
  const [isIdChecked, setIsIdChecked] = useState(false);
  const navigate = useNavigate();

  //  ID 중복 체크 함수 (실제 API 호출)
  const checkIdDuplicate = async (loginId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/check-id?loginId=${loginId}`
      );

      if (response.data && response.data.isDuplicate === true) {
        console.log("서버 응답: 중복된 아이디입니다.");
        return true; // 중복임
      }

      console.log("서버 응답: 사용 가능한 아이디입니다.");
      return false; // 중복이 아님
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return true;
      }

      // 403 Forbidden 에러 처리 (Security 설정 확인 필요)
      // 403 에러가 났으므로 ID 중복 확인을 진행할 수 없었기 때문에 중복이라고 처리하는 것이 안전합니다.
      if (error.response && error.response.status === 403) {
        console.error("ID 중복 확인 중 403 Forbidden 오류:", error);
        alert("ID 중복 확인에 필요한 권한이 없습니다. (403 Forbidden)");
        return true; // 에러 발생 시 가입 방지를 위해 true 반환
      }

      console.error("ID 중복 확인 중 예상치 못한 오류:", error);
      alert(
        error.response?.data ||
          "ID 중복 확인 중 예상치 못한 오류가 발생했습니다."
      );
      return true;
    }
  };

  // ID 중복 확인 버튼 핸들러
  const onIdDuplicateCheckHandle = async () => {
    if (!id.trim()) {
      alert("아이디를 입력해주세요!");
      setIsIdChecked(false);
      return;
    }

    // 아이디 유효성 검사 (6~20자, 영문/숫자 등 필요 시 추가)
    if (id.trim().length < 6 || id.trim().length > 20) {
      alert("아이디는 6자 이상 20자 이하로 입력해주세요.");
      setIsIdChecked(false);
      return;
    }

    const isDuplicate = await checkIdDuplicate(id);

    if (isDuplicate) {
      alert("이미 사용 중인 아이디입니다. 다른 아이디를 사용해주세요.");
      setIsIdChecked(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true); // 중복 확인 완료 상태로 설정
    }
  };

  const onEmailVerificationHandle = async () => {
    if (!email.trim()) {
      alert("이메일 주소를 입력해주세요!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/request-verification",
        {
          email: email,
        }
      );
      alert("인증코드가 발급되었습니다.");
      setIsEmailVerified(true);
    } catch (error) {
      console.error("이메일 인증 요청 오류:", error);
      alert(error.response?.data || "이메일 인증 요청 중 오류가 발생했습니다.");
    }
  };

  const validateForm = async () => {
    const emptyFields = [];
    if (!id.trim()) emptyFields.push("아이디");
    if (!password.trim()) emptyFields.push("비밀번호");
    if (!passwordConfirm.trim()) emptyFields.push("비밀번호 재입력");
    if (!email.trim()) emptyFields.push("이메일");
    if (!verificationCode.trim()) emptyFields.push("인증코드");
    if (!name.trim()) emptyFields.push("이름");
    if (!birth.trim()) emptyFields.push("생년월일");

    if (emptyFields.length === 7) {
      return "필수 항목을 모두 입력해주세요!";
    }

    if (!id.trim()) return "아이디를 입력해주세요!";
    // ⭐️ 추가: 아이디 중복 확인 여부 체크
    if (!isIdChecked) return "아이디 중복 확인이 필요합니다!";
    if (!password.trim()) return "비밀번호를 입력해주세요!";
    if (!passwordConfirm.trim()) return "비밀번호 재입력을 입력해주세요!";
    if (!email.trim()) return "이메일을 입력해주세요!";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "유효한 이메일 주소를 입력해주세요!";
    if (!isEmailVerified)
      return "이메일 인증을 완료해야 회원가입이 가능합니다!";
    if (!verificationCode.trim()) return "이메일 인증 코드를 입력해주세요!";
    if (!name.trim()) return "이름을 입력해주세요!";
    if (!birth.trim()) return "생년월일을 입력해주세요!";

    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./\\-]).{8,16}$/;
    if (!pwRegex.test(password))
      return "비밀번호 규정을 확인해주세요 (8~16자, 숫자/영문/특수문자 포함)";

    if (password !== passwordConfirm)
      return "비밀번호와 비밀번호 재입력이 일치하지 않습니다!";

    const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthRegex.test(birth)) return "유효한 생년월일을 입력해주세요!";

    return null;
  };

  const onRegisterHandle = async (e) => {
    e.preventDefault();

    const errorMsg = await validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const response = await api.post("/users/signup", {
        loginId: id,
        loginPwd: password,
        email: email,
        verificationCode: verificationCode,
        usersName: name,
        usersBirthday: birth, // "YYYY-MM-DD" 형식
        usersDescription: "", // 선택값
      });

      alert("회원가입에 성공하였습니다!!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "회원가입 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const onCancelHandle = () => {
    setId("");
    setPassword("");
    setPasswordConfirm("");
    setEmail("");
    setIsEmailVerified(false);
    setVerificationCode(""); // 인증코드 상태 초기화 추가
    setName("");
    setBirth("");
    setIsIdChecked(false); // ⭐️ ID 중복확인 상태 초기화 추가
    navigate(-1);
  };

  return (
    <div className="register-container">
      <div className="page-title">
        <p>회원가입</p>
      </div>
      <div className="register-form">
        <form>
          <p className="form-title">아이디</p>
          <div className="input-with-icon">
            <FaRegIdCard className="icon" />
            <input
              className="input-placeholder"
              type="text"
              placeholder="아이디 입력 (6~20자)"
              value={id}
              // ⭐️ 아이디 변경 시 중복 확인 상태 초기화
              onChange={(e) => {
                setId(e.target.value);
                setIsIdChecked(false);
              }}
              // ⭐️ 중복 확인이 완료되면 수정 불가
              disabled={isIdChecked}
            />
            {/* ⭐️ "중복 확인" 버튼에 핸들러 연결 */}
            <button
              className="dup-check"
              type="button"
              onClick={onIdDuplicateCheckHandle}
              disabled={isIdChecked}
            >
              중복 확인
            </button>
          </div>
          <p className="form-title">비밀번호</p>
          <div className="input-with-icon">
            <PiLockKeyBold className="icon" />
            <input
              className="input-placeholder"
              type="password"
              placeholder="비밀번호 입력 (문자, 숫자, 특수문자 포함 8~16자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="form-title">비밀번호 확인</p>
          <div className="input-with-icon">
            <PiLockKeyBold className="icon" />
            <input
              className="input-placeholder"
              type="password"
              placeholder="비밀번호 재입력"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <p className="form-title">이메일</p>
          <div className="input-with-icon">
            <MdOutlineMailOutline className="icon" />
            <input
              className="input-placeholder"
              type="email"
              placeholder="Sample@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailVerified(false);
              }}
              disabled={isEmailVerified}
            />

            <button
              className="dup-check"
              type="button"
              onClick={onEmailVerificationHandle}
              disabled={isEmailVerified}
            >
              인증 요청
            </button>
          </div>
          <p className="form-title">인증코드</p>
          <div className="input-with-icon">
            <IoIosBarcode className="icon" />
            <input
              className="input-placeholder"
              type="text"
              placeholder="인증코드 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={!isEmailVerified}
            />
          </div>
          <p className="form-title">이름</p>
          <div className="input-with-icon">
            <FaUser className="icon" />
            <input
              className="input-placeholder"
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <p className="form-title">생년월일</p>
          <div className="input-with-icon">
            <LiaBirthdayCakeSolid className="icon" />
            <input
              className="input-placeholder"
              type="text"
              placeholder="YYYY-MM-DD"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            <button
              className="register-btn"
              type="submit"
              onClick={onRegisterHandle}
            >
              register
            </button>
            <button
              className="cancel-btn"
              type="button"
              onClick={onCancelHandle}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
