import "../css/Register.css";
import { FaRegIdCard, FaUser } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { PiLockKeyBold } from "react-icons/pi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//회원가입 컴포넌트
const Register = () => {
  // 상태
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [call, setCall] = useState("");
  const [birth, setBirth] = useState(""); // 생년월일
  const navigate = useNavigate();

  // ID 중복 체크 예시 함수 (실제 API 호출 필요)
  const checkIdDuplicate = async (id) => {
    // TODO: 실제 API 호출
    // 예: const res = await fetch(`/api/check-id?id=${id}`);
    // return res.json().exists;
    return false; // 임시: 중복 아님
  };

  const validateForm = async () => {
    const emptyFields = [];
    if (!id.trim()) emptyFields.push("아이디");
    if (!password.trim()) emptyFields.push("비밀번호");
    if (!passwordConfirm.trim()) emptyFields.push("비밀번호 재입력");
    if (!name.trim()) emptyFields.push("이름");
    if (!call.trim()) emptyFields.push("전화번호");
    if (!birth.trim()) emptyFields.push("생년월일");

    if (emptyFields.length === 6) {
      // 모든 필수 항목이 비어 있는 경우
      return "필수 항목을 모두 입력해주세요!";
    }

    // 개별 항목 체크
    if (!id.trim()) return "아이디를 입력해주세요!";
    if (!password.trim()) return "비밀번호를 입력해주세요!";
    if (!passwordConfirm.trim()) return "비밀번호 재입력을 입력해주세요!";
    if (!name.trim()) return "이름을 입력해주세요!";
    if (!call.trim()) return "전화번호를 입력해주세요!";
    if (!birth.trim()) return "생년월일을 입력해주세요!";

    // ID 중복 체크
    const isDuplicate = await checkIdDuplicate(id);
    if (isDuplicate) return "이미 사용 중인 아이디입니다!";

    // 비밀번호 규정 체크
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./\\-]).{8,16}$/;
    if (!pwRegex.test(password))
      return "비밀번호 규정을 확인해주세요 (8~16자, 숫자/영문/특수문자 포함)";

    if (password !== passwordConfirm)
      return "비밀번호와 비밀번호 재입력이 일치하지 않습니다!";

    // 생년월일 형식 체크 (YYYY-MM-DD)
    const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthRegex.test(birth)) return "유효한 생년월일을 입력해주세요!";

    return null;
  };

  // 회원가입 핸들러
  const onRegisterHandle = async (e) => {
    e.preventDefault();

    const errorMsg = await validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        {
          username: id,
          password: password,
          name: name,
          phone: call,
          birth: birth,
        }
      );

      alert(response.data); // Spring Boot에서 반환하는 메시지
      navigate("/"); // 회원가입 성공 시 메인 페이지 이동
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data ||
          "회원가입 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  // 입력값 초기화 후 이전 페이지로 돌아가기
  const onCancelHandle = () => {
    setId("");
    setPassword("");
    setPasswordConfirm("");
    setName("");
    setCall("");
    setBirth("");
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
              onChange={(e) => setId(e.target.value)}
            />
            <button className="dup-check" type="button">
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

          <p className="form-title">전화번호</p>
          <div className="input-with-icon">
            <IoCall className="icon" />
            <input
              className="input-placeholder"
              type="tel"
              placeholder="휴대 번호 입력"
              value={call}
              onChange={(e) => setCall(e.target.value)}
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
