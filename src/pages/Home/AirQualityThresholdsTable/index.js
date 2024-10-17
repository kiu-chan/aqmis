import React from 'react';
import './AirQualityThresholdsTable.css';

const AirQualityThresholdsTable = () => {
  return (
    <div className="air-quality-table-container">
      <table className="air-quality-table">
        <caption>Giá trị giới hạn các thông số cơ bản trong không khí</caption>
        <thead>
          <tr>
            <th>TT</th>
            <th>Thông số</th>
            <th>Trung bình 1 giờ</th>
            <th>Trung bình 8 giờ</th>
            <th>Trung bình 24 giờ</th>
            <th>Trung bình 1 năm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>SO₂</td>
            <td>350</td>
            <td>-</td>
            <td>125</td>
            <td>50</td>
          </tr>
          <tr>
            <td>2</td>
            <td>CO</td>
            <td>30.000</td>
            <td>10.000</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>3</td>
            <td>NO₂</td>
            <td>200</td>
            <td>-</td>
            <td>100</td>
            <td>40</td>
          </tr>
          <tr>
            <td>4</td>
            <td>O₃</td>
            <td>200</td>
            <td>120</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Tổng bụi lơ lửng (TSP)</td>
            <td>300</td>
            <td>-</td>
            <td>200</td>
            <td>100</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Bụi PM₁₀</td>
            <td>-</td>
            <td>-</td>
            <td>100</td>
            <td>50</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Bụi PM₂.₅</td>
            <td>-</td>
            <td>-</td>
            <td>50</td>
            <td>25 (45*)</td>
          </tr>
        </tbody>
      </table>
      <div className="table-note">
        <p>Ghi chú:</p>
        <p>- Dấu ( - ) là không quy định</p>
        <p>- (*): Giá trị nồng độ áp dụng từ ngày 01 tháng 01 năm 2026.</p>
      </div>
      <div className="table-source">
        Theo QCVN 05:2023/BTNMT - Quy chuẩn kỹ thuật quốc gia về chất lượng không khí ban hành kèm theo Thông tư số 01/2023/TT-BTNMT ngày 13/03/2023 của Bộ trưởng Bộ Tài nguyên và Môi trường.
      </div>
    </div>
  );
};

export default AirQualityThresholdsTable;