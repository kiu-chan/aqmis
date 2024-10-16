import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AirQualityChart.css';

const data = [
  { date: '2024-09-15', pm25: 81.04, pm10: 120, so2: 20, co: 0.8 },
  { date: '2024-09-20', pm25: 30, pm10: 50, so2: 15, co: 0.6 },
  { date: '2024-09-25', pm25: 70, pm10: 100, so2: 25, co: 1.0 },
  { date: '2024-09-26', pm25: 81.04, pm10: 130, so2: 30, co: 1.2 },
  { date: '2024-10-05', pm25: 40, pm10: 70, so2: 18, co: 0.7 },
  { date: '2024-10-10', pm25: 110, pm10: 180, so2: 35, co: 1.5 },
  { date: '2024-10-15', pm25: 60, pm10: 90, so2: 22, co: 0.9 },
];

const ChartCard = ({ title, dataKey, unit, color }) => (
  <div className="chart-card">
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={color} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
    <p className="unit">Đơn vị: {unit}</p>
  </div>
);

const AirQualityChart = () => {
  return (
    <div className="charts-container">
      <h2>Biểu đồ chất lượng không khí</h2>
      <div className="charts-grid">
        <ChartCard title="Nồng độ PM2.5" dataKey="pm25" unit="µg/m³" color="#8884d8" />
        <ChartCard title="Nồng độ PM10" dataKey="pm10" unit="µg/m³" color="#82ca9d" />
        <ChartCard title="Nồng độ SO2" dataKey="so2" unit="ppb" color="#ffc658" />
        <ChartCard title="Nồng độ CO" dataKey="co" unit="ppm" color="#ff7300" />
      </div>
    </div>
  );
};

export default AirQualityChart;