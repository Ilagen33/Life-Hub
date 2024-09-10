//FinanceManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinanceManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: 'food',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  // Funzione per caricare le transazioni
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/finance');
      setTransactions(response.data);
    } catch (error) {
      console.error('Errore durante il recupero delle transazioni:', error);
    }
  };

  // Funzione per aggiungere una nuova transazione
  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/finance', newTransaction);
      fetchTransactions(); // Aggiorna la lista delle transazioni
      setNewTransaction({ type: 'expense', amount: '', category: 'food', date: '', note: '' });
    } catch (error) {
      console.error('Errore durante l\'aggiunta della transazione:', error);
    }
  };

  // Funzione per cancellare una transazione
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/finance/${id}`);
      fetchTransactions(); // Aggiorna la lista delle transazioni
    } catch (error) {
      console.error('Errore durante la cancellazione della transazione:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Gestione Finanziaria</h2>

      <form onSubmit={addTransaction}>
        <label>Tipo:</label>
        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
        >
          <option value="income">Entrata</option>
          <option value="expense">Spesa</option>
        </select>

        <label>Importo:</label>
        <input
          type="number"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          required
        />

        <label>Categoria:</label>
        <select
          value={newTransaction.category}
          onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
        >
          <option value="food">Cibo</option>
          <option value="rent">Affitto</option>
          <option value="salary">Stipendio</option>
          <option value="investment">Investimenti</option>
          <option value="others">Altro</option>
        </select>

        <label>Data:</label>
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
          required
        />

        <label>Nota:</label>
        <input
          type="text"
          value={newTransaction.note}
          onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
        />

        <button type="submit">Aggiungi Transazione</button>
      </form>

      <h3>Transazioni</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.type === 'income' ? 'Entrata' : 'Spesa'} - {transaction.amount} € -{' '}
            {transaction.category} - {new Date(transaction.date).toLocaleDateString()}
            <button onClick={() => deleteTransaction(transaction._id)}>Cancella</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinanceManager;
