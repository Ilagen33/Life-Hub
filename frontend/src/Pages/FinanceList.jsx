//FinanceList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { Line } from 'react-chartjs-2'; // O Recharts, se preferisci
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const FinanceList = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [finances, setFinances] = useState([]);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const res = await axiosInstance.get('/finance', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          },
        });
        setFinances(res.data);
      } catch (err) {
        console.error('Errore:', err);
      }
    };
    if(authToken) {
    fetchFinances();
    }
  }, [authToken]);

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
