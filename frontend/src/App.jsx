import React from "react";
import MatchDetail from "./MatchDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Template from "./template/Template";
import CoinRecharge from "./Coin/CoinRecharge";
import CoinChargeHistory from "./Coin/CoinChargeHistory";
import Payment from "./Coin/Payment";
import Register from "./Register/Register";
import Search from "./page/Search";
import MyPage from "./page/MyPage/MyPage";
import Login from "./login/Login";
import Requestdetail from "./requestdetail.jsx";
import RequestReceived from "./RequestReceived/RequestReceived.jsx";
import MarkPage from "./page/MyPage/MarkPage";
import FindPassword from "./login/Findpassword.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin" element={<CoinRecharge />} />
          <Route path="/coinHistory" element={<CoinChargeHistory />} />
          <Route path="/pay" element={<Payment />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/Mypage" element={<MyPage />} />
          <Route path="/matchdetail" element={<MatchDetail />} />
          <Route path="/requestdetail" element={<Requestdetail />} />
          <Route path="/requestReceived" element={<RequestReceived />} />
          <Route path="/mark" element={<MarkPage />} />
        </Routes>
      </Template>
    </BrowserRouter>
  );
};

export default App;
