import React, { useState } from "react";
import api from "../api/axios";

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/users/find-password",
        { email }
      );
      if (response.status === 200) {
        setMessage("비밀번호 재설정 메일을 보냈습니다.");
      }
    } catch (error) {
      setMessage("요청 실패: 다시 시도해주세요.");
    }
  };

  return (
    <div className="findpasswordcomponent">
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="가입한 이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">비밀번호 재설정</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FindPassword;
