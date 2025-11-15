import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./components/Register";
import Template from "./template/Template";
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
          <Route path="/register" element={<Register />} />
          <Route path="/coin" element={<CoinRecharge />} />
          <Route path="/coinHistory" element={<CoinChargeHistory />} />
          <Route path="/pay" element={<Payment />} />
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
