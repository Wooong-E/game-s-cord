import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./Register/Register";
import Template from "./template/Template";
import Register from "./Register/Register";
import CoinRecharge from "./Coin/CoinRecharge";
import CoinChargeHistory from "./Coin/CoinChargeHistory";
import Payment from "./Coin/Payment";

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
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
