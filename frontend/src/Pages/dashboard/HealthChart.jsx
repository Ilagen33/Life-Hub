// HealthChart.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';


import axios from '../axiosInstance';

const HealthChart = () => {
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await axios.get('/health');
        setHealthData(res.data);
      } catch (err) {
        console.error('Errore durante il caricamento dei dati di salute:', err);
      }
    };
    fetchHealthData();
  }, []);

  const data = {
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

  const options = {
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

  const dati = {
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
    <div>
      <h2>Monitoraggio della Salute</h2>
      <Line data={data} options={options} />
      <Bar data={dati} />;
    </div>
  );
};

export default HealthChart;
