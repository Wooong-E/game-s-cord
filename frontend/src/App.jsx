import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MyPage from "./page/MyPage/MyPage";
import Template from "./template/Template";
import Login from "./login/Login.jsx";
import FindPassword from "./login/Findpassword.jsx";
import Register from "./components/Register";
import CoinRecharge from "./components/CoinRecharge";
import CoinChargeHistory from "./components/CoinChargeHistory";
import Payment from "./components/Payment";

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
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
