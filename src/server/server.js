const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const airQualityRoutes = require('./routes/airQuality');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/air-quality', airQualityRoutes);  // Đảm bảo route này được kết nối

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});