import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from '../TopNavBar';
import './News.css';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/posts?category=tin-tuc');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu tin tức:', err);
        setError('Không thể tải dữ liệu tin tức. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchPosts();

    // Kiểm tra role của người dùng
    const user = JSON.parse(localStorage.getItem('user'));
    setIsAdmin(user && user.role === 'admin');
  }, []);

  const handleAddPost = () => {
    navigate('/add-post');
  };

  const handleEditPost = (postId) => {
    navigate(`/news/edit-post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await axios.delete(`http://localhost:3001/api/posts/${postId}`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Lỗi khi xóa bài viết:', err);
        alert('Không thể xóa bài viết. Vui lòng thử lại sau.');
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-page">
      <TopNavBar />
      <div className="news-content">
        <div className="news-header">
          <h1>Tin tức</h1>
          {isAdmin && (
            <button onClick={handleAddPost} className="add-post-button" title="Thêm tin tức">
              +
            </button>
          )}
        </div>
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <h2>
                <Link to={`/news/post/${post.id}`}>{post.title}</Link>
              </h2>
              <p>Tác giả: {post.author_name}</p>
              <p>Ngày đăng: {new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
              <p>Lượt xem: {post.view_count}</p>
              {isAdmin && (
                <div className="post-actions">
                  <button onClick={() => handleEditPost(post.id)} className="edit-button">Sửa</button>
                  <button onClick={() => handleDeletePost(post.id)} className="delete-button">Xóa</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;