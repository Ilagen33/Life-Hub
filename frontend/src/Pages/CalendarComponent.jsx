//CalendarComponent.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/calendar');
        setEvents(response.data);
      } catch (error) {
        console.error('Errore durante il recupero degli eventi:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const eventsOnSelectedDate = events.filter(
      (event) =>
        new Date(event.startDate).toDateString() === selectedDate.toDateString()
    );
    setSelectedDateEvents(eventsOnSelectedDate);
  };

  return (
    <div>
      <h2>Calendario</h2>
      <Calendar value={date} onChange={handleDateChange} />
      <div>
        <h3>Eventi del {date.toDateString()}:</h3>
        {selectedDateEvents.length > 0 ? (
          <ul>
            {selectedDateEvents.map((event) => (
              <li key={event._id}>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <p>Inizio: {new Date(event.startDate).toLocaleString()}</p>
                <p>Fine: {new Date(event.endDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun evento per questa data.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;