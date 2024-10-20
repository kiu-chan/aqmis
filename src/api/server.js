const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000'
}));

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'thai_nguyen_air_quality_db',
  password: '123456',
  port: 5432,
});

app.get('/api/air-quality', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM thai_nguyen_air_quality ORDER BY measurement_time DESC LIMIT 24');
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (err) {
    console.error('Lỗi khi truy vấn database:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
});

app.get('/api/air-quality-thresholds', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        parameter,
        MAX(CASE WHEN EXTRACT(EPOCH FROM (NOW() - measurement_time)) <= 7200 THEN value END) as hour_2,
        MAX(CASE WHEN EXTRACT(EPOCH FROM (NOW() - measurement_time)) <= 28800 THEN value END) as hour_8,
        AVG(CASE WHEN measurement_time >= NOW() - INTERVAL '24 HOURS' THEN value END) as hour_24,
        AVG(CASE WHEN measurement_time >= NOW() - INTERVAL '7 DAYS' THEN value END) as week_1
      FROM (
        SELECT 'AQI' as parameter, measurement_time, aqi as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'CO' as parameter, measurement_time, co as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'PM10' as parameter, measurement_time, pm10 as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'PM2.5' as parameter, measurement_time, pm25 as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'SO2' as parameter, measurement_time, so2 as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'Temperature' as parameter, measurement_time, temperature as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'Humidity' as parameter, measurement_time, humidity as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'Pressure' as parameter, measurement_time, pressure as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'Dew Point' as parameter, measurement_time, dew_point as value FROM thai_nguyen_air_quality
        UNION ALL
        SELECT 'Wind' as parameter, measurement_time, wind as value FROM thai_nguyen_air_quality
      ) subquery
      GROUP BY parameter
      ORDER BY parameter
    `);
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (err) {
    console.error('Lỗi khi truy vấn database:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});