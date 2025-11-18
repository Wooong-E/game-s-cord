import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Template from "./template/Template";
import Register from "./Register/Register";
import Search from "./page/Search";

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/search" element={<Search/>} />
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
