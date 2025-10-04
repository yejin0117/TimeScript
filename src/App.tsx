import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import FindPage from "./pages/FindPage";
import CreatePerson from "./pages/CreatePerson";
import SelectTimePage from "./pages/SelectTimePage";
import ConfirmTimePage from "./pages/ConfirmTimePage";

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
        
        {/* 그룹원 및 그룹장 정보 페이지 */}
        <Route path="/createPerson" element={<CreatePerson />} />
        
        {/* 약속 시간 선택 페이지 */}
        <Route path="/selectTime" element={<SelectTimePage />} />
        
        {/* 약속 시간 확정 페이지 */}
        <Route path="/result" element={<ConfirmTimePage />} />
      </Routes>
    </Router>
  );
};

export default App;
