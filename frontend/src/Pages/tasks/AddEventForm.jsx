import React, { useState } from 'react';
import axios from 'axios';

const AddEventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('Appointment');
  const [allDay, setAllDay] = useState(false);
  const [loading, setLoading] = useState(false); // Stato per il caricamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verifica che la data di fine sia dopo la data di inizio
    if (new Date(endDate) <= new Date(startDate)) {
      alert('La data di fine deve essere successiva alla data di inizio');
      return;
    }

    setLoading(true); // Avvia il caricamento
    try {
      const newEvent = { title, description, startDate, endDate, category, allDay };
      await axios.post('/api/calendar/add', newEvent);
      alert('Evento aggiunto con successo!');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCategory('Appointment');
      setAllDay(false);
    } catch (error) {
      console.error("Errore durante l'aggiunta dell'evento:", error);
      alert('Si è verificato un errore, riprova.');
    } finally {
      setLoading(false); // Fine del caricamento
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Aggiungi Nuovo Evento</h2>

      {/* Titolo */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Titolo</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Inserisci il titolo dell'evento"
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
          placeholder="Aggiungi una descrizione (opzionale)"
          rows="4"
        />
      </div>

      {/* Data inizio */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Inizio Evento</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {/* Data fine */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Fine Evento</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {/* Categoria */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Appointment">Appuntamento</option>
          <option value="Deadline">Scadenza</option>
          <option value="Reminder">Promemoria</option>
          <option value="Event">Evento</option>
        </select>
      </div>

      {/* Evento per tutto il giorno */}
      <div className="mb-6">
        <label className="inline-flex items-center text-gray-700 font-semibold">
          <input
            type="checkbox"
            checked={allDay}
            onChange={() => setAllDay(!allDay)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Evento per tutto il giorno</span>
        </label>
      </div>

      {/* Bottone di invio */}
      <button
        type="submit"
        className={`w-full p-3 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
        disabled={loading} // Disabilita il bottone durante il caricamento
      >
        {loading ? 'Caricamento...' : 'Aggiungi Evento'}
      </button>
    </form>
  );
};

export default AddEventForm;
