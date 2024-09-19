import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import axios from '../../utils/axiosInstance.js';
import { useAuth } from '../../context/AuthContext.js'; // Importa il contesto di autenticazione

// Importa e registra le scale e altri componenti da Chart.js
import {
  Chart as ChartJS,
  CategoryScale, // Scala di categoria che mancava
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registra i componenti di Chart.js necessari
ChartJS.register(
  CategoryScale, // Scala di categoria per l'asse X
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HealthChart = () => {
  const { authToken } = useAuth();  // Prendi il token di autenticazione dal contesto
  const [healthData, setHealthData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await axios.get('/HealthData', {
          headers: { Authorization: `Bearer ${authToken}` },  // Includi il token nella richiesta
        });
        setHealthData(res.data);
      } catch (err) {
        console.error('Errore durante il caricamento dei dati di salute:', err);
      }
    };

    const fetchProductivityData = async () => {
      try {
        const res = await axios.get('/activity', {
          headers: { Authorization: `Bearer ${authToken}` },  // Includi il token nella richiesta
        });
        console.log(res.data);
        setProductivityData(res.data);
      } catch (err) {
        console.error('Errore durante il caricamento dei dati di produttività:', err);
      }
    };

    if (authToken) {  // Verifica che il token sia disponibile prima di fare la richiesta
      fetchHealthData();
      fetchProductivityData();
    }
  }, [authToken]);

  const healthChartData = {
    labels: healthData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Peso (kg)',
        data: healthData.map(entry => entry.weight),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Ore di Sonno',
        data: healthData.map(entry => entry.sleepHours),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      }
    ]
  };

  const healthChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  const productivityChartData = {
    labels: productivityData.map(entry => entry.week),
    datasets: [
      {
        label: 'Attività Completate',
        data: productivityData.map(entry => entry.completedTasks),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2>Monitoraggio della Salute</h2>
      <Line data={healthChartData} options={healthChartOptions} />
      <h2>Produttività</h2>
      <Bar data={productivityChartData} />
    </div>
  );
};

export default HealthChart;
