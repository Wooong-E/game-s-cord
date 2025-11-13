import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [input, setInput] = useState({ id: "", password: "" });
  const navigate = useNavigate();

  const onChangeId = (e) => setInput({ ...input, id: e.target.value });
  const onChangePassword = (e) =>
    setInput({ ...input, password: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, password } = input;

    try {
      const response = await axios.post("https://your-backend-api.com/login", {
        id,
        password,
      });

      if (response.status === 200) {
        console.log("로그인 성공:", response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="logincomponent">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="sample@gmail.com"
          onChange={onChangeId}
          value={input.id}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={onChangePassword}
          value={input.password}
        />
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