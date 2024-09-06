import React, { useState } from 'react';
import axios from 'axios';

const FinanceForm = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/finances/add', {
        type,
        category,
        amount,
        note,
      });
      alert('Transazione aggiunta con successo!');
      setCategory('');
      setAmount(0);
      setNote('');
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Aggiungi Transazione</h2>
      <div>
        <label>Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Spesa</option>
          <option value="income">Entrata</option>
        </select>
      </div>
      <div>
        <label>Categoria</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="es. Cibo, Trasporti"
          required
        />
      </div>
      <div>
        <label>Importo</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Opzionale"
        />
      </div>
      <button type="submit">Aggiungi</button>
    </form>
  );
};

export default FinanceForm;
