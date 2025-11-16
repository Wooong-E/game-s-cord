import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MyPage from "./page/MyPage/MyPage";
import Template from "./template/Template";
import Login from "./login/Login.jsx";
import FindPassword from "./login/Findpassword.jsx";
import Register from "./Register/Register.jsx";
import CoinRecharge from "./Coin/CoinRecharge";
import CoinChargeHistory from "./Coin/CoinChargeHistory";
import Payment from "./Coin/Payment.jsx";
import Search from "./page/Search";
import JoinGameMatch from "./Match/JoinGameMatch.jsx";

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/coin" element={<CoinRecharge />} />
          <Route path="/coinHistory" element={<CoinChargeHistory />} />
          <Route path="/pay" element={<Payment />} />
          <Route path="/search" element={<Search />} />
          <Route path="/match" element={<JoinGameMatch />} /> {/*임시 라우트*/}
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
