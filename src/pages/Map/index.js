import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const [aqiData, setAqiData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapCenter = [21.592477, 105.8435398]; // Tọa độ trung tâm Thành phố Thái Nguyên
  const zoomLevel = 11;

  const mapStyle = {
    width: '100%',
    height: '100vh'
  };

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await axios.get(
          `https://api.waqi.info/feed/thai-nguyen/?token=e8dea9aed2e37eaff01397deff8071c26660d44e`
        );
        setAqiData(response.data.data);
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };

    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch('/ThaiNguyen.geojson');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchAQIData();
    fetchGeoJsonData();
  }, []);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400'; // Green
    if (aqi <= 100) return '#ffff00'; // Yellow
    if (aqi <= 150) return '#ff7e00'; // Orange
    if (aqi <= 200) return '#ff0000'; // Red
    if (aqi <= 300) return '#8f3f97'; // Purple
    return '#7e0023'; // Maroon
  };

  const formatValue = (value, unit = '') => {
    return value ? `${value}${unit}` : 'N/A';
  };

  const geoJSONStyle = (feature) => {
    return {
      fillColor: getAQIColor(aqiData ? aqiData.aqi : 0),
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

  return (
    <MapContainer center={mapCenter} zoom={zoomLevel} style={mapStyle}>
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
              <p style={{ color: getAQIColor(aqiData.aqi) }}>AQI: {aqiData.aqi}</p>
              <p>PM2.5: {formatValue(aqiData.iaqi.pm25?.v, ' µg/m³')}</p>
              <p>PM10: {formatValue(aqiData.iaqi.pm10?.v, ' µg/m³')}</p>
              <p>SO2: {formatValue(aqiData.iaqi.so2?.v, ' ppb')}</p>
              <p>CO: {formatValue(aqiData.iaqi.co?.v, ' ppm')}</p>
              <p>Temperature: {formatValue(aqiData.iaqi.t?.v, '°C')}</p>
              <p>Pressure: {formatValue(aqiData.iaqi.p?.v, ' hPa')}</p>
              <p>Humidity: {formatValue(aqiData.iaqi.h?.v, '%')}</p>
              <p>Wind: {formatValue(aqiData.iaqi.w?.v, ' m/s')}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;