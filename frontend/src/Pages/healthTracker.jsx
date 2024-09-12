//healthTracker.jsx
import React, { useState, useEffect } from 'react';
import HealthTracker from '../Pages/dashboard/HealthChart';
import axiosInstance from '../utils/axiosInstance.js';
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const HealthPage = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await axiosInstance.get('/HealthData', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          },
        }); // Endpoint per ottenere i dati di salute
        setHealthData(res.data);
      } catch (err) {
        console.error('Errore nel caricamento dei dati di salute:', err);
      }
    };
    if(authToken) {
    fetchHealthData();
    }
  }, [authToken]);

  return (
    <div>
      <h1>Monitoraggio della Salute</h1>
      <HealthTracker healthData={healthData} />
    </div>
  );
};

export default HealthPage;
