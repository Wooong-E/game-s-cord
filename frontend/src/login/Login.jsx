import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";

const BACKEND_URL = "http://localhost:8080";

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
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      let responseData;
      let displayMsg = "로그인 처리 중 오류가 발생했습니다.";
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (isJson) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        console.log("로그인 성공:", responseData);
        const token = responseData.token;
        if (token) {
          localStorage.setItem("accessToken", token);
          console.log("JWT 토큰 저장 완료");
        } else {
          console.warn("응답 데이터에 토큰이 없습니다.");
        }

        navigate("/");
      } else {
        console.error(`로그인 실패 응답 (${response.status}):`, responseData);
        if (isJson && responseData.message) {
          displayMsg = responseData.message;
        } else if (
          typeof responseData === "string" &&
          response.status === 400
        ) {
          displayMsg = responseData;
        } else if (response.status === 401) {
          displayMsg = "아이디 또는 비밀번호가 일치하지 않습니다.";
        } else if (response.status === 404) {
          displayMsg = "서버 경로를 찾을 수 없습니다.";
        } else {
          displayMsg = `서버 오류 발생 (상태 코드: ${response.status})`;
        }
        setErrorMsg(displayMsg);
      }
    } catch (error) {
      console.error("네트워크 또는 처리 오류:", error);

      setErrorMsg("서버와의 통신 연결에 문제가 발생했습니다.");
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
