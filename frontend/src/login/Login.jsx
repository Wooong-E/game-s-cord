import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../login.css';

// 💡 백엔드 서버의 포트를 최종적으로 8080에 맞춘 상태입니다.
const BACKEND_URL = "http://localhost:8080"; 

const Login = () => {
  const [input, setInput] = useState({ id: "", password: "" });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onChangeId = (e) => setInput({ ...input, id: e.target.value });
  const onChangePassword = (e) =>
    setInput({ ...input, password: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { id, password } = input;

    const requestBody = {
      loginId: id,
      loginPwd: password,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // --- 응답 처리 로직 수정 시작 ---
      
      let responseData;
      let displayMsg = "로그인 처리 중 오류가 발생했습니다.";
      
      // 💡 1. 응답 Content-Type 확인 및 데이터 파싱
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (isJson) {
        // 응답이 JSON이면 JSON으로 파싱 (성공/실패 모두 JSON일 때)
        responseData = await response.json();
      } else {
        // 응답이 JSON이 아니면 텍스트로 파싱 (이전 오류 발생 상황)
        responseData = await response.text(); 
      }
      
      // 💡 2. 응답 상태에 따른 분기 처리
      if (response.ok) { // HTTP 상태 코드 200-299 (성공)
        console.log("로그인 성공:", responseData);
        
        // JWT 토큰 처리
        const token = responseData.token; 
        if (token) {
          localStorage.setItem('accessToken', token);
          console.log("JWT 토큰 저장 완료");
        } else {
          console.warn("응답 데이터에 토큰이 없습니다. 백엔드 응답을 확인하세요.");
        }

        navigate("/dashboard");
      } else { // 4xx, 5xx (실패)
        console.error(`로그인 실패 응답 (${response.status}):`, responseData);
        
        if (isJson && responseData.message) {
            // 백엔드가 JSON 형태로 메시지를 보낸 경우 (권장 방식)
            displayMsg = responseData.message;
        } else if (typeof responseData === 'string' && response.status === 400) {
            // 백엔드가 400 오류와 함께 텍스트만 보낸 경우 ("등록된 사용자가 없습니다." 상황)
            displayMsg = responseData;
        } else if (response.status === 401) {
             // 401 Unauthorized를 명시적으로 처리
             displayMsg = "아이디 또는 비밀번호가 일치하지 않습니다.";
        }
        
        setErrorMsg(displayMsg);
      }
      
      // --- 응답 처리 로직 수정 끝 ---

    } catch (error) {
      // 주로 네트워크 연결 문제 또는 JSON 파싱 오류(SyntaxError)를 잡음
      console.error("네트워크 또는 처리 오류:", error);
      // 'Unexpected token' 오류가 발생하면 텍스트 응답을 처리하지 못했기 때문일 수 있음.
      setErrorMsg("서버와의 통신 연결에 문제가 발생했습니다. (연결 상태 확인 필요)");
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
        
        {/* 💡 에러 메시지 표시 */}
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

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