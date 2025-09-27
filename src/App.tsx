import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import FindPage from "./pages/FindPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 홈 화면 */}
        <Route path="/" element={<HomePage />} />

        {/* 약속 만들기 페이지 */}
        <Route path="/create" element={<CreatePage />} />

        {/* 그룹 찾기 페이지 */}
        <Route path="/groupFind" element={<FindPage />} />
      </Routes>
    </Router>
  );
};

export default App;
