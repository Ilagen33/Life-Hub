//healthTracker.jsx
import React, { useState, useEffect } from 'react';
import HealthTracker from '../Pages/dashboard/HealthChart';
import axios from '../axiosInstance';

const HealthPage = () => {
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await axios.get('/api/health'); // Endpoint per ottenere i dati di salute
        setHealthData(res.data);
      } catch (err) {
        console.error('Errore nel caricamento dei dati di salute:', err);
      }
    };

    fetchHealthData();
  }, []);

  return (
    <div>
      <h1>Monitoraggio della Salute</h1>
      <HealthTracker healthData={healthData} />
    </div>
  );
};

export default HealthPage;
