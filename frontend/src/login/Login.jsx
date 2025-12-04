import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";
import api from "../api/axios";

const Login = () => {
  const [input, setInput] = useState({ id: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onChangeId = (e) => setInput({ ...input, id: e.target.value });
  const onChangePassword = (e) =>
    setInput({ ...input, password: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { id, password } = input;

    const requestBody = {
      loginId: id,
      loginPwd: password,
    };

    try {
      const response = await api.post("/users/login", requestBody);

      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("JWT 토큰 저장 완료");
      } else {
        setErrorMsg("로그인 응답에 토큰이 없습니다.");
        return;
      }
      navigate("/");
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("로그인 오류:", error.response || error);

      if (error.response?.status === 401) {
        setErrorMsg("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (error.response?.status === 404) {
        setErrorMsg("서버를 찾을 수 없습니다.");
      } else if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("서버와의 통신 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="logincomponent">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="로그인 ID (예: sample@gmail.com)"
          onChange={onChangeId}
          value={input.id}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={onChangePassword}
          value={input.password}
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <div>
          <Link to="/signup">회원가입</Link>
          <Link to="/find-password">비밀번호 재설정</Link>
        </div>

        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
