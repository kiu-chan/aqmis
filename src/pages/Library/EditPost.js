import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TopNavBar from '../TopNavBar';
import './AddPost.css';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('thu-vien');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCategory(response.data.category);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài viết:', err);
        setError('Không thể tải dữ liệu bài viết. Vui lòng thử lại sau.');
      }
    };

    fetchPost();
  }, [id]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'admin') {
        setError('Bạn không có quyền chỉnh sửa bài viết');
        return;
      }

      const response = await axios.put(`http://localhost:3001/api/posts/${id}`, {
        title,
        content,
        category
      });

      if (response.data) {
        navigate(category === 'tin-tuc' ? '/tin-tuc' : '/thu-vien');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật bài viết:', err);
      setError('Không thể cập nhật bài viết. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="edit-post-page">
      <TopNavBar />
      <div className="edit-post-content">
        <h1>Chỉnh sửa bài viết</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="thu-vien">Thư viện</option>
              <option value="tin-tuc">Tin tức</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="content">Nội dung</label>
            <ReactQuill 
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
          </div>
          <button type="submit" className="submit-button">Cập nhật bài viết</button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;