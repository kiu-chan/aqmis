import React from 'react';

const DataSelector = ({ 
  selectedTimeOption, 
  selectedDate,
  selectedIndexOption, 
  onTimeOptionChange, 
  onDateChange,
  onIndexOptionChange,
  availableDates
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="data-selector">
      <div className="time-selector">
        <label>
          <input
            type="radio"
            value="current"
            checked={selectedTimeOption === 'current'}
            onChange={() => onTimeOptionChange('current')}
          />
          Giá trị hiện tại
        </label>
        <label>
          <input
            type="radio"
            value="forecast"
            checked={selectedTimeOption === 'forecast'}
            onChange={() => onTimeOptionChange('forecast')}
          />
          Dự báo
        </label>
      </div>
      {selectedTimeOption === 'forecast' && (
        <>
          <div className="date-selector">
            <select 
              value={selectedDate} 
              onChange={(e) => onDateChange(e.target.value)}
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>
          <div className="index-selector">
            <select 
              value={selectedIndexOption} 
              onChange={(e) => onIndexOptionChange(e.target.value)}
            >
              <option value="pm25">PM2.5</option>
              <option value="pm10">PM10</option>
              <option value="o3">O3</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default DataSelector;