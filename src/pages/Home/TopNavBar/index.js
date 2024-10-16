import React from 'react';
import './TopNavBar.css';

const TopNavBar = () => {
  return (
    <nav className="top-nav-bar">
      <div className="nav-container">
        <div className="nav-title">
          QUAN TRẮC THÁI NGUYÊN
        </div>
        
        <div className="nav-links">
          <a href="/" className="nav-link" aria-label="Trang chủ">TRANG CHỦ</a>
          <a href="/tin-tuc" className="nav-link" aria-label="Tin tức">TIN TỨC</a>
          <a href="/thu-vien" className="nav-link" aria-label="Thư viện">THƯ VIỆN</a>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="search-input"
              aria-label="Nhập từ khóa tìm kiếm"
            />
            <button className="search-button" aria-label="Tìm kiếm">🔍</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;