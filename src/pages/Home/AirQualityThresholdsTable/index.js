import React, { useState, useEffect } from 'react';
import './AirQualityThresholdsTable.css';

const AirQualityThresholdsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/air-quality-thresholds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (e) {
        console.error("Có lỗi khi tải dữ liệu:", e);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatValue = (value, parameter) => {
    if (value === null) return 'N/A';
    const numValue = parseFloat(value);
    switch (parameter) {
      case 'AQI':
        return numValue.toFixed(0);
      case 'Temperature':
      case 'Dew Point':
        return `${numValue.toFixed(1)}°C`;
      case 'Humidity':
        return `${numValue.toFixed(1)}%`;
      case 'Pressure':
        return `${numValue.toFixed(1)} hPa`;
      case 'Wind':
        return `${numValue.toFixed(1)} m/s`;
      default:
        return numValue.toFixed(2);
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="air-quality-table-container">
      <table className="air-quality-table">
        <caption>Thống kê chất lượng không khí Thái Nguyên</caption>
        <thead>
          <tr>
            <th>Thông số</th>
            <th>2 giờ gần nhất</th>
            <th>8 giờ gần nhất</th>
            <th>Trung bình 24 giờ</th>
            <th>Trung bình 1 tuần</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.parameter}>
              <td>{row.parameter}</td>
              <td>{formatValue(row.hour_2, row.parameter)}</td>
              <td>{formatValue(row.hour_8, row.parameter)}</td>
              <td>{formatValue(row.hour_24, row.parameter)}</td>
              <td>{formatValue(row.week_1, row.parameter)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-note">
        <p>Ghi chú: Tất cả các giá trị được tính toán dựa trên dữ liệu thực tế đo đạc được.</p>
      </div>
      <div className="table-source">
        Dữ liệu được cập nhật tự động từ cơ sở dữ liệu chất lượng không khí Thái Nguyên.
      </div>
    </div>
  );
};

export default AirQualityThresholdsTable;