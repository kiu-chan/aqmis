import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './AirQualityMap.css';
import DataSelector from './DataSelector';

// Sửa lỗi cho biểu tượng marker mặc định
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
        
        // Tạo mảng các ngày có sẵn cho dự báo (5 ngày tiếp theo)
        const today = new Date();
        const nextFiveDays = Array.from({length: 5}, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i + 1);
          return date.toISOString().split('T')[0];
        });
        setAvailableDates(nextFiveDays);
        setSelectedDate(nextFiveDays[0]); // Chọn ngày đầu tiên mặc định
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
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return 'Tốt';
    if (aqi <= 100) return 'Trung bình';
    if (aqi <= 150) return 'Kém';
    if (aqi <= 200) return 'Xấu';
    if (aqi <= 300) return 'Rất xấu';
    return 'Nguy hại';
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
          backgroundColor: getAQIColor(displayAQI.avg),
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
              </div>
            )}
          </div>
        </div>
        <div className="info-messages">
          <p><span role="img" aria-label="warning">⚠️</span> Nhóm nhạy cảm có thể chịu những tác động nhất định tới sức khỏe</p>
          <p><span role="img" aria-label="info">ℹ️</span> Nhóm người bình thường: Tự do thực hiện các hoạt động ngoài trời.</p>
          <p><span role="img" aria-label="caution">🚸</span> Nhóm người nhạy cảm: Nên theo dõi các triệu chứng như ho hoặc khó thở, nhưng vẫn có thể hoạt động bên ngoài.</p>
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
                  <p style={{ color: getAQIColor(displayAQI.avg) }}>
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