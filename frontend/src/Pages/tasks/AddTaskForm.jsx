import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false); // Per gestire lo stato di caricamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Imposta lo stato di caricamento

    try {
      const newTask = { title, description, priority, dueDate };
      await axios.post('/api/tasks/add', newTask);
      alert('Attività aggiunta con successo!');
      
      // Resetta i campi del form
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
    } catch (error) {
      console.error('Errore durante l\'aggiunta dell\'attività:', error);
    } finally {
      setLoading(false); // Disabilita lo stato di caricamento
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-md w-3/4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Aggiungi Nuova Attività</h2>

      {/* Titolo */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Titolo</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Inserisci il titolo della task"
          required
        />
      </div>

      {/* Descrizione */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Descrizione</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Descrizione opzionale"
          rows="4"
        />
      </div>

      {/* Priorità */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Priorità</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Low">Bassa</option>
          <option value="Medium">Media</option>
          <option value="High">Alta</option>
        </select>
      </div>

      {/* Data di Scadenza */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Data di Scadenza</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Pulsante di Invio */}
      <button
        type="submit"
        className={`w-full p-3 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
        disabled={loading} // Disabilita il pulsante durante il caricamento
      >
        {loading ? 'Aggiungendo...' : 'Aggiungi Attività'}
      </button>
    </form>
  );
};

export default AddTaskForm;
