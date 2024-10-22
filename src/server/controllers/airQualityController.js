const db = require('../db');
const { Parser } = require('json2csv');

exports.getAirQualityData = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM thai_nguyen_air_quality ORDER BY measurement_time DESC LIMIT 24');
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu chất lượng không khí:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};

exports.getAirQualityThresholds = async (req, res) => {
  try {
    const result = await db.query(`
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
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi khi truy vấn ngưỡng chất lượng không khí:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};


exports.downloadAirQualityData = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM thai_nguyen_air_quality ORDER BY measurement_time DESC');
    
    const fields = [
      { 
        label: 'Thời gian đo',
        value: 'measurement_time',
        stringify: (value) => new Date(value).toLocaleString('vi-VN')
      },
      { 
        label: 'Chỉ số AQI',
        value: 'aqi'
      },
      { 
        label: 'Nồng độ CO (ppm)',
        value: 'co'
      },
      { 
        label: 'PM10 (µg/m³)',
        value: 'pm10'
      },
      { 
        label: 'PM2.5 (µg/m³)',
        value: 'pm25'
      },
      { 
        label: 'Nhiệt độ (°C)',
        value: 'temperature'
      },
      { 
        label: 'Độ ẩm (%)',
        value: 'humidity'
      },
      { 
        label: 'Áp suất (hPa)',
        value: 'pressure'
      },
      { 
        label: 'Nồng độ SO2 (ppb)',
        value: 'so2'
      },
      { 
        label: 'Điểm sương (°C)',
        value: 'dew_point'
      },
      { 
        label: 'Gió (m/s)',
        value: 'wind'
      }
    ];

    const json2csvParser = new Parser({ 
      fields,
      delimiter: ',',
      quote: '"',
      header: true,
    });
    
    const csv = json2csvParser.parse(result.rows);
    
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('du_lieu_chat_luong_khong_khi.csv');
    return res.send('\uFEFF' + csv); // Thêm BOM để Excel hiển thị đúng tiếng Việt
  } catch (err) {
    console.error('Lỗi khi tải xuống dữ liệu chất lượng không khí:', err);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};