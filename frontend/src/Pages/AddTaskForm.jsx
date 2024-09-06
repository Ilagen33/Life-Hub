import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title, description, priority, dueDate };
      await axios.post('/api/tasks/add', newTask);
      alert('Attività aggiunta con successo!');
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
    } catch (error) {
      console.error('Errore durante l\'aggiunta dell\'attività:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Aggiungi Nuova Attività</h2>
      <div>
        <label>Titolo</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Descrizione</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Priorità</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Bassa</option>
          <option value="Medium">Media</option>
          <option value="High">Alta</option>
        </select>
      </div>

      <div>
        <label>Data di Scadenza</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit">Aggiungi Attività</button>
    </form>
  );
};

export default AddTaskForm;
