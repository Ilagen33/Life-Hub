import React, { useState } from 'react';
import axios from 'axios';

const AddEventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('Appointment');
  const [allDay, setAllDay] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.error('Errore durante l\'aggiunta dell\'evento:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Aggiungi Nuovo Evento</h2>
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
        <label>Inizio Evento</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Fine Evento</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Appointment">Appuntamento</option>
          <option value="Deadline">Scadenza</option>
          <option value="Reminder">Promemoria</option>
          <option value="Event">Evento</option>
        </select>
      </div>

      <div>
        <label>Evento per tutto il giorno</label>
        <input
          type="checkbox"
          checked={allDay}
          onChange={() => setAllDay(!allDay)}
        />
      </div>

      <button type="submit">Aggiungi Evento</button>
    </form>
  );
};

export default AddEventForm;
