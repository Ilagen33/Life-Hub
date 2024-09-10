//FinanceList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; // O Recharts, se preferisci

const FinanceList = () => {
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const res = await axios.get('/api/finances');
        setFinances(res.data);
      } catch (err) {
        console.error('Errore:', err);
      }
    };
    fetchFinances();
  }, []);

  const data = {
    labels: finances.map(f => f.category),
    datasets: [
      {
        label: 'Spese',
        data: finances
          .filter(f => f.type === 'expense')
          .map(f => f.amount),
        borderColor: 'red',
        fill: false,
      },
      {
        label: 'Entrate',
        data: finances
          .filter(f => f.type === 'income')
          .map(f => f.amount),
        borderColor: 'green',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Riepilogo Finanziario</h2>
      <Line data={data} />
      <ul>
        {finances.map((finance, index) => (
          <li key={index}>
            {finance.type === 'expense' ? 'Spesa' : 'Entrata'} - {finance.category}: {finance.amount}€
            {finance.note && <span> - Note: {finance.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinanceList;
