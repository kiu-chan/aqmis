import React from 'react';
import TopNavBar from './TopNavBar';
import AirQualityMap from './AirQualityMap';
import AirQualityChart from './AirQualityChart';

function Home() {
    return (
        <div>
            <TopNavBar />
            <main style={{ maxWidth: '1200px', margin: '1rem auto' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Chào mừng đến với Cổng Thông tin Quan trắc Thái Nguyên
                </h1>
                <AirQualityMap />
                <AirQualityChart />
            </main>
        </div>
    )
}

export default Home;