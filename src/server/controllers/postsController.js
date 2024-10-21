const db = require('../db');

exports.getAllPosts = async (req, res) => {
    const { category } = req.query;
    try {
      let query = `
        SELECT posts.id, posts.title, posts.created_at, posts.view_count, users.full_name as author_name
        FROM posts
        JOIN users ON posts.author_id = users.id
      `;
      
      const queryParams = [];
      if (category) {
        query += ' WHERE posts.category = $1';
        queryParams.push(category);
      }
      
      query += ' ORDER BY posts.created_at DESC';
      
      const result = await db.query(query, queryParams);
      res.json(result.rows);
    } catch (err) {
      console.error('Lỗi khi truy vấn bài đăng:', err);
      res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  };

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT posts.*, users.full_name as author_name
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE posts.id = $1
    `, [id]);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Không tìm thấy bài đăng' });
    }
  } catch (err) {
    console.error('Lỗi khi truy vấn chi tiết bài đăng:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};

exports.incrementViewCount = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', [id]);
    res.json({ message: 'Đã tăng lượt xem thành công' });
  } catch (err) {
    console.error('Lỗi khi tăng lượt xem:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};

exports.addPost = async (req, res) => {
    const { title, content, author_id, category } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO posts (title, content, author_id, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, author_id, category]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Lỗi khi thêm bài viết:', err);
      res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  };

  exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    try {
      const result = await db.query(
        'UPDATE posts SET title = $1, content = $2, category = $3 WHERE id = $4 RETURNING *',
        [title, content, category, id]
      );
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Không tìm thấy bài viết' });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật bài viết:', err);
      res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  };

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Bài viết đã được xóa thành công' });
    } else {
      res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }
  } catch (err) {
    console.error('Lỗi khi xóa bài viết:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};