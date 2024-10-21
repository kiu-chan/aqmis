import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TopNavBar from '../TopNavBar';
import './AddPost.css';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('thu-vien');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        setError('Bạn không có quyền thêm bài viết');
        return;
      }

      const response = await axios.post('http://localhost:3001/api/posts', {
        title,
        content,
        author_id: user.id,
        category
      });

      if (response.data) {
        navigate(category === 'tin-tuc' ? '/tin-tuc' : '/thu-vien');
      }
    } catch (err) {
      console.error('Lỗi khi thêm bài viết:', err);
      setError('Không thể thêm bài viết. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="add-post-page">
      <TopNavBar />
      <div className="add-post-content">
        <h1>Thêm bài viết mới</h1>
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
          <button type="submit" className="submit-button">Đăng bài</button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;