import React from "react";
import MatchDetail from "./MatchDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Template from "./template/Template";
import Register from "./Register/Register";
import Search from "./page/Search";
import MyPage from "./page/MyPage/MyPage";
import Login from "./login/Login";


const App = () => {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search/>} />
          <Route path="/Mypage" element={<MyPage />} />
          <Route path="/matchdetail" element={<MatchDetail />} />
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
