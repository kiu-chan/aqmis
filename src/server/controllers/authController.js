const db = require('../db');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Đăng xuất thành công' });
};