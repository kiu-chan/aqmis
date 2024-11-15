import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './AirQualityMap.css';
import DataSelector from './DataSelector';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AirQualityMap = () => {
  const [aqiData, setAqiData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedTimeOption, setSelectedTimeOption] = useState('current');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedIndexOption, setSelectedIndexOption] = useState('pm25');
  const [availableDates, setAvailableDates] = useState([]);
  const mapCenter = [21.592477, 105.8435398];
  const zoomLevel = 11;

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await axios.get(
          `https://api.waqi.info/feed/thai-nguyen/?token=e8dea9aed2e37eaff01397deff8071c26660d44e`
        );
        setAqiData(response.data.data);
        
        const today = new Date();
        const nextFiveDays = Array.from({length: 5}, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i + 1);
          return date.toISOString().split('T')[0];
        });
        setAvailableDates(nextFiveDays);
        setSelectedDate(nextFiveDays[0]);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu AQI:", error);
      }
    };

    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch('/ThaiNguyen.geojson');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu GeoJSON:", error);
      }
    };

    fetchAQIData();
    fetchGeoJsonData();
  }, []);

  const getAQIColor = (aqi) => {
    if (!aqi) return '#999999';
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const getAQIStatus = (aqi) => {
    if (!aqi) return 'Không có dữ liệu';
    if (aqi <= 50) return 'Tốt';
    if (aqi <= 100) return 'Trung bình';
    if (aqi <= 150) return 'Kém';
    if (aqi <= 200) return 'Xấu';
    if (aqi <= 300) return 'Rất xấu';
    return 'Nguy hại';
  };

  const getAQIWarnings = (aqi) => {
    if (!aqi) return {
      general: 'Không có dữ liệu đo được.',
      sensitive: 'Không có dữ liệu đo được.',
      normal: 'Không có dữ liệu đo được.',
      outdoor: 'Không có dữ liệu đo được.',
      icon: '❓',
      color: '#999999'
    };

    if (aqi <= 50) return {
      general: 'Chất lượng không khí tốt.',
      sensitive: 'Có thể tham gia các hoạt động ngoài trời.',
      normal: 'Hoàn toàn có thể tham gia các hoạt động ngoài trời.',
      outdoor: 'Thời điểm lý tưởng để hoạt động ngoài trời.',
      icon: '✅',
      color: '#00e400'
    };

    if (aqi <= 100) return {
      general: 'Chất lượng không khí ở mức chấp nhận được.',
      sensitive: 'Nên cân nhắc giảm thời gian hoạt động ngoài trời kéo dài.',
      normal: 'Có thể tiếp tục các hoạt động ngoài trời bình thường.',
      outdoor: 'Có thể tiến hành các hoạt động ngoài trời nhưng nên theo dõi các triệu chứng hô hấp.',
      icon: '⚠️',
      color: '#ffff00'
    };

    if (aqi <= 150) return {
      general: 'Không khí đang ở mức độ không tốt cho sức khỏe đối với nhóm nhạy cảm.',
      sensitive: 'Nên hạn chế các hoạt động ngoài trời kéo dài. Đeo khẩu trang khi ra ngoài.',
      normal: 'Cân nhắc giảm thời gian hoạt động ngoài trời.',
      outdoor: 'Nên rút ngắn thời gian hoạt động ngoài trời và đeo khẩu trang.',
      icon: '🚧',
      color: '#ff7e00'
    };

    if (aqi <= 200) return {
      general: 'Không khí có hại cho sức khỏe.',
      sensitive: 'Tránh các hoạt động ngoài trời. Sử dụng khẩu trang và máy lọc không khí.',
      normal: 'Hạn chế các hoạt động ngoài trời. Đeo khẩu trang khi ra ngoài.',
      outdoor: 'Không nên tổ chức các hoạt động ngoài trời kéo dài.',
      icon: '❗',
      color: '#ff0000'
    };

    if (aqi <= 300) return {
      general: 'Không khí rất có hại cho sức khỏe.',
      sensitive: 'Ở trong nhà và sử dụng máy lọc không khí. Tránh các hoạt động ngoài trời.',
      normal: 'Hạn chế tối đa các hoạt động ngoài trời. Đeo khẩu trang N95 khi buộc phải ra ngoài.',
      outdoor: 'Hủy bỏ hoặc dời các hoạt động ngoài trời không cần thiết.',
      icon: '🔴',
      color: '#8f3f97'
    };

    return {
      general: 'Không khí ở mức nguy hiểm!',
      sensitive: 'Tuyệt đối không ra ngoài. Sử dụng máy lọc không khí trong nhà.',
      normal: 'Hạn chế tối đa việc ra ngoài. Đeo khẩu trang N95 nếu buộc phải ra ngoài.',
      outdoor: 'Hủy bỏ tất cả các hoạt động ngoài trời.',
      icon: '☠️',
      color: '#7e0023'
    };
  };

  const formatValue = (value, unit = '') => {
    return value ? `${value}${unit}` : 'N/A';
  };

  const geoJSONStyle = (feature) => {
    return {
      fillColor: getAQIColor(getDisplayAQI().avg),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  const handleTimeOptionChange = (option) => {
    setSelectedTimeOption(option);
    if (option === 'current') {
      setSelectedIndexOption('pm25');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleIndexOptionChange = (option) => {
    setSelectedIndexOption(option);
  };

  const getDisplayAQI = () => {
    if (!aqiData) return { avg: null, day: null, max: null, min: null };
    
    if (selectedTimeOption === 'current') {
      return { 
        avg: aqiData.aqi, 
        day: new Date().toISOString().split('T')[0],
        max: aqiData.aqi,
        min: aqiData.aqi
      };
    } else {
      const forecastData = aqiData.forecast.daily[selectedIndexOption];
      if (forecastData && forecastData.length > 0) {
        const selectedForecast = forecastData.find(item => item.day === selectedDate);
        if (selectedForecast) {
          return selectedForecast;
        }
      }
      return { avg: null, day: selectedDate, max: null, min: null };
    }
  };

  const getDisplayUnit = () => {
    switch (selectedIndexOption) {
      case 'o3':
        return 'ppb';
      case 'pm10':
      case 'pm25':
        return 'µg/m³';
      default:
        return '';
    }
  };

  const displayAQI = getDisplayAQI();
  const warnings = getAQIWarnings(displayAQI.avg);

  return (
    <div className="air-quality-container">
      <div className="info-panel">
        <DataSelector 
          selectedTimeOption={selectedTimeOption} 
          selectedDate={selectedDate}
          selectedIndexOption={selectedIndexOption}
          onTimeOptionChange={handleTimeOptionChange}
          onDateChange={handleDateChange}
          onIndexOptionChange={handleIndexOptionChange}
          availableDates={availableDates}
        />
        
        <div className="aqi-box" style={{ 
          backgroundColor: warnings.color,
          color: displayAQI.avg > 100 ? 'white' : 'black'
        }}>
          <h3>
            {selectedTimeOption === 'current' 
              ? 'Chỉ số Chất lượng không khí hiện tại' 
              : `Dự báo ${selectedIndexOption.toUpperCase()} cho ngày ${new Date(displayAQI.day).toLocaleDateString('vi-VN')}`}
          </h3>
          <div className="aqi-info">
            <div className="aqi-value">
              <h2>{selectedTimeOption === 'current' ? 'AQI' : selectedIndexOption.toUpperCase()}</h2>
              <h1>{displayAQI.avg || 'N/A'}</h1>
              <p>{displayAQI.avg ? (selectedTimeOption === 'current' ? getAQIStatus(displayAQI.avg) : getDisplayUnit()) : 'N/A'}</p>
            </div>
            {selectedTimeOption === 'forecast' && (
              <div className="forecast-details">
                <p>Giá trị tối đa: {formatValue(displayAQI.max, getDisplayUnit())}</p>
                <p>Giá trị tối thiểu: {formatValue(displayAQI.min, getDisplayUnit())}</p>
              </div>
            )}
            {selectedTimeOption === 'current' && (
              <div className="aqi-details">
                <p>
                  <span role="img" aria-label="humidity">💧</span> Độ ẩm: {aqiData ? formatValue(aqiData.iaqi.h?.v, '%') : 'N/A'}
                </p>
                <p>
                  <span role="img" aria-label="temperature">🌡️</span> Nhiệt độ: {aqiData ? formatValue(aqiData.iaqi.t?.v, '°C') : 'N/A'}
                </p>
                <p>
                  <span role="img" aria-label="wind">🌪️</span> Gió: {aqiData ? formatValue(aqiData.iaqi.w?.v, 'm/s') : 'N/A'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="info-messages">
          <p className="warning-message" style={{borderLeftColor: warnings.color}}>
            <span role="img" aria-label="status">{warnings.icon}</span> {warnings.general}
          </p>
          <p className="warning-message" style={{borderLeftColor: warnings.color}}>
            <span role="img" aria-label="info">ℹ️</span> Nhóm người bình thường: {warnings.normal}
          </p>
          <p className="warning-message" style={{borderLeftColor: warnings.color}}>
            <span role="img" aria-label="warning">⚕️</span> Nhóm người nhạy cảm: {warnings.sensitive}
          </p>
          <p className="warning-message" style={{borderLeftColor: warnings.color}}>
            <span role="img" aria-label="outdoor">🏃</span> Hoạt động ngoài trời: {warnings.outdoor}
          </p>
        </div>
      </div>

      <div className="map-panel">
        <MapContainer center={mapCenter} zoom={zoomLevel} className="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoJsonData && aqiData && (
            <GeoJSON 
              data={geoJsonData} 
              style={geoJSONStyle}
              onEachFeature={onEachFeature}
            />
          )}
          {aqiData && (
            <Marker position={[aqiData.city.geo[0], aqiData.city.geo[1]]}>
              <Popup>
                <div>
                  <h3>{aqiData.city.name}</h3>
                  <p style={{ color: warnings.color }}>
                    {selectedTimeOption === 'current' ? 'AQI' : selectedIndexOption.toUpperCase()}: {displayAQI.avg}
                  </p>
                  {selectedTimeOption === 'forecast' && (
                    <>
                      <p>Ngày: {new Date(displayAQI.day).toLocaleDateString('vi-VN')}</p>
                      <p>Tối đa: {displayAQI.max}</p>
                      <p>Tối thiểu: {displayAQI.min}</p>
                    </>
                  )}
                  <p>PM2.5: {formatValue(aqiData.iaqi.pm25?.v, ' µg/m³')}</p>
                  <p>PM10: {formatValue(aqiData.iaqi.pm10?.v, ' µg/m³')}</p>
                  <p>O3: {formatValue(aqiData.iaqi.o3?.v, ' ppb')}</p>
                  <p>SO2: {formatValue(aqiData.iaqi.so2?.v, ' ppb')}</p>
                  <p>CO: {formatValue(aqiData.iaqi.co?.v, ' ppm')}</p>
                  <p>Nhiệt độ: {formatValue(aqiData.iaqi.t?.v, '°C')}</p>
                  <p>Áp suất: {formatValue(aqiData.iaqi.p?.v, ' hPa')}</p>
                  <p>Độ ẩm: {formatValue(aqiData.iaqi.h?.v, '%')}</p>
                  <p>Gió: {formatValue(aqiData.iaqi.w?.v, ' m/s')}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default AirQualityMap;