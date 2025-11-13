import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./other/Login.jsx";
import FindPassword from "./other/Findpassword.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/find-password" element={<FindPassword />} />
      </Routes>
    </Router>
  );
}

export default App;