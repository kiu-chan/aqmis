import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './AirQualityChart.css';

const ChartCard = ({ title, dataKey, unit, color, data }) => {
  const maxValue = Math.max(...data.map(item => parseFloat(item[dataKey]) || 0));
  const yAxisMax = maxValue * 1.1;

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="measurement_time" 
            tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
          />
          <YAxis 
            domain={[0, yAxisMax]} 
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip 
            labelFormatter={(label) => new Date(label).toLocaleString()} 
            formatter={(value) => [parseFloat(value).toFixed(2), unit]}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="unit">Đơn vị: {unit}</p>
    </div>
  );
};

const AirQualityChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/air-quality');
        setData(response.data);
        setError(null);
      } catch (e) {
        console.error("Có lỗi khi tải dữ liệu:", e);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Kiểm tra trạng thái đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!user);
  }, []);

  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/air-quality/download', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'du_lieu_chat_luong_khong_khi.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Lỗi khi tải xuống dữ liệu:", error);
      alert("Không thể tải xuống dữ liệu. Vui lòng thử lại sau.");
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="charts-container">
      <h2>Biểu đồ chất lượng không khí</h2>
      {isLoggedIn && (
        <button onClick={handleDownload} className="download-button">
          Tải xuống dữ liệu
        </button>
      )}
      <div className="charts-list">
        <ChartCard title="Chỉ số chất lượng không khí (AQI)" dataKey="aqi" unit="" color="#8884d8" data={data} />
        <ChartCard title="Nồng độ CO" dataKey="co" unit="ppm" color="#82ca9d" data={data} />
        <ChartCard title="Nồng độ PM10" dataKey="pm10" unit="µg/m³" color="#ffc658" data={data} />
        <ChartCard title="Nồng độ PM2.5" dataKey="pm25" unit="µg/m³" color="#ff7300" data={data} />
        <ChartCard title="Nhiệt độ" dataKey="temperature" unit="°C" color="#e74c3c" data={data} />
        <ChartCard title="Độ ẩm" dataKey="humidity" unit="%" color="#3498db" data={data} />
        <ChartCard title="Áp suất" dataKey="pressure" unit="hPa" color="#2ecc71" data={data} />
        <ChartCard title="Nồng độ SO2" dataKey="so2" unit="ppb" color="#f39c12" data={data} />
      </div>
    </div>
  );
};

export default AirQualityChart;