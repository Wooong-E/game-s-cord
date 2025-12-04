import React from "react";
import MatchDetail from "./MatchDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Template from "./template/Template";
import JoinGameMatch from "./Match/JoinGameMatch.jsx";
import CoinRecharge from "./Coin/CoinRecharge";
import CoinChargeHistory from "./Coin/CoinChargeHistory";
import Payment from "./Coin/Payment";
import Register from "./Register/Register";
import Search from "./page/Search";
import MyPage from "./page/MyPage/MyPage";
import Login from "./login/Login";
import Requestdetail from "./requestdetail.jsx";
import MarkPage from "./page/MyPage/MarkPage";
import FindPassword from "./login/Findpassword.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<JoinGameMatch />} /> {/*임시 라우트*/}
          <Route path="/coin" element={<CoinRecharge />} />
          <Route path="/coinHistory" element={<CoinChargeHistory />} />
          <Route path="/pay" element={<Payment />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/Mypage" element={<MyPage />} />
          <Route path="/gameMate" element={<JoinGameMatch />} />
          <Route path="/matchdetail" element={<MatchDetail />} />
          <Route path="/requestdetail" element={<Requestdetail />} />
          <Route path="/mark" element={<MarkPage />} />
        </Routes>
      </Template>
    </BrowserRouter>
  );
};

export default App;
