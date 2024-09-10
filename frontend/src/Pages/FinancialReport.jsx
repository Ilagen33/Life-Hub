//FinancialReport.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FinancialReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/finance', {
        params: { startDate, endDate },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Errore durante il recupero delle transazioni:', error);
    }
  };

  const calculateTotal = (type) => {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  return (
    <div>
      <h2>Report Finanziario</h2>
      <label>Data Inizio:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <label>Data Fine:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <button onClick={fetchTransactions}>Genera Report</button>

      <h3>Totale Entrate: {calculateTotal('income')} €</h3>
      <h3>Totale Spese: {calculateTotal('expense')} €</h3>

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.type === 'income' ? 'Entrata' : 'Spesa'} - {transaction.amount} € -{' '}
            {transaction.category} - {new Date(transaction.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialReport;
