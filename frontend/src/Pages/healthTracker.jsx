import React from 'react';
import { Line } from 'react-chartjs-2';

const HealthTracker = ({ healthData }) => {
  const data = {
    labels: healthData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Peso',
        data: healthData.map((entry) => entry.weight),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={data} />;
};

export default HealthTracker;
