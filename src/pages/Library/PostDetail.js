import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from '../TopNavBar';
import './PostDetail.css';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
        // Tăng lượt xem sau khi lấy dữ liệu thành công
        await axios.post(`http://localhost:3001/api/posts/${id}/view`);
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết bài đăng:', err);
        setError('Không thể tải chi tiết bài đăng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Không tìm thấy bài đăng</div>;

  return (
    <div className="post-detail-page">
      <TopNavBar />
      <div className="post-detail-content">
        <h1>{post.title}</h1>
        <p>Tác giả: {post.author_name}</p>
        <p>Ngày đăng: {new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
        <p>Lượt xem: {post.view_count}</p>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default PostDetail;