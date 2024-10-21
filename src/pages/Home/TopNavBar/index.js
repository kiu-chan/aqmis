import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TopNavBar.css';

const TopNavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <nav className="top-nav-bar">
      <div className="nav-container">
        <div className="nav-title">
          QUAN TRẮC THÁI NGUYÊN
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">TRANG CHỦ</Link>
          <Link to="/tin-tuc" className="nav-link">TIN TỨC</Link>
          <Link to="/thu-vien" className="nav-link">THƯ VIỆN</Link>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
          
          {user ? (
            <>
              <span className="user-info">Xin chào, {user.full_name}</span>
              <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" className="nav-link login-button">ĐĂNG NHẬP</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;