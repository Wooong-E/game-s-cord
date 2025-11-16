import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MyPage from "./page/MyPage/MyPage";
import Template from "./template/Template";
import Login from "./other/Login.jsx";
import FindPassword from "./other/Findpassword.jsx";

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
