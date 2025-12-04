import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Findpassword.css";

const FindPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setMessage("");
    // ... (기존 로직 유지) ...
    try {
      const response = await api.post(
        "/auth/request-password-reset", 
        { email }
      );
      if (response.status === 200) {
        setMessage(
          "비밀번호 재설정 요청 메일을 보냈습니다. 메일함 확인 후 인증코드와 새 비밀번호를 입력해주세요."
        );
        setStep("reset"); 
      }
    } catch (error) {
      setMessage("요청 실패: 이메일을 확인하거나 다시 시도해주세요.");
    }
  };


  const handleFinalReset = async (e) => {
    e.preventDefault();
    setMessage("");
    // ... (기존 로직 유지) ...
    if (!code || !newPassword) {
      setMessage("인증코드와 새 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await api.post(
        "/auth/reset-password",
        { 
          email: email, 
          code: code, 
          newPassword: newPassword 
        }
      );

      if (response.status === 200) {
        setMessage("비밀번호가 성공적으로 재설정되었습니다.");
        setTimeout(() => {
            navigate('/login'); 
        }, 1000);
        setStep("complete");
        setEmail("");
        setCode("");
        setNewPassword("");
      }
    } catch (error) {
      setMessage("비밀번호 재설정 실패: 인증코드가 유효하지 않거나 다시 시도해주세요.");
    }
  };

  return (
    <div className="findpasswordcomponent">
      {step === "email" && (
        <div className="findpassword-card">
          <h2>비밀번호 재설정</h2>
          <p className="input-hint" style={{ fontSize: '16px', marginBottom: '20px' }}>
            가입하신 이메일을 입력해주세요
          </p>
          <form onSubmit={handleRequestReset}>
            <input
              type="email"
              placeholder="Sample@gmail.com"
              className="findpassword-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="findpassword-btn">
              이메일 입력
            </button>
          </form>
        </div>
      )}

      {step === "reset" && (
        <div className="findpassword-card">
          <h2>비밀번호 재설정</h2>
          <form onSubmit={handleFinalReset}>
            <p className="input-hint" style={{ margin: '0 0 5px 0' }}>인증코드</p>
            <input
              type="text"
              placeholder="메일로 받은 인증 코드"
              className="findpassword-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="input-hint" style={{ margin: '15px 0 5px 0' }}>새 비밀번호</p>
            <p className="input-hint">
              비밀번호 규칙 (숫자, 특수문자 포함 8~20자)
            </p>
            <input
              type="password"
              placeholder="새 비밀번호 재설정"
              className="findpassword-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="findpassword-btn">
              비밀번호 재설정
            </button>
          </form>
        </div>
      )}

      {message && <p className={message.includes("실패") ? "findpassword-error" : "findpassword-message"}>{message}</p>}
      {step === "complete" && <p>로그인 페이지로 돌아가시겠습니까?</p>}
    </div>
  );
};

export default FindPassword;