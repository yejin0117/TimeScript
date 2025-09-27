import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Settings from './components/Settings';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    // 페이지 분배를 위한 playground, 축구장
    <BrowserRouter>
    {/* 페이지 그룹 */}
      <Routes>
        <Route path={'/'} element={<Home/>} />
        <Route path={'/settings'} element={<Settings/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;