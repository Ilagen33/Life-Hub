//PreferencesForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PreferencesForm = () => {
  const [layout, setLayout] = useState('default');
  const [widgets, setWidgets] = useState([]);
  const [integrations, setIntegrations] = useState({
    googleDrive: false,
    email: false,
    calendar: false,
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api/preferences');
        setLayout(response.data.dashboardLayout);
        setWidgets(response.data.widgets);
        setIntegrations(response.data.integrations);
      } catch (error) {
        console.error('Errore durante il recupero delle preferenze:', error);
      }
    };

    fetchPreferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/preferences', { dashboardLayout: layout, widgets, integrations });
      alert('Preferenze aggiornate con successo!');
    } catch (error) {
      console.error('Errore durante l\'aggiornamento delle preferenze:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Preferenze Dashboard</h2>

      <label>Layout Dashboard:</label>
      <select value={layout} onChange={(e) => setLayout(e.target.value)}>
        <option value="default">Predefinito</option>
        <option value="compact">Compatto</option>
      </select>

      <label>Widget Attivi:</label>
      <div>
        <input
          type="checkbox"
          checked={widgets.includes('tasks')}
          onChange={(e) => {
            const newWidgets = e.target.checked
              ? [...widgets, 'tasks']
              : widgets.filter((widget) => widget !== 'tasks');
            setWidgets(newWidgets);
          }}
        /> To-Do List
        <input
          type="checkbox"
          checked={widgets.includes('calendar')}
          onChange={(e) => {
            const newWidgets = e.target.checked
              ? [...widgets, 'calendar']
              : widgets.filter((widget) => widget !== 'calendar');
            setWidgets(newWidgets);
          }}
        /> Calendario
        <input
          type="checkbox"
          checked={widgets.includes('weather')}
          onChange={(e) => {
            const newWidgets = e.target.checked
              ? [...widgets, 'weather']
              : widgets.filter((widget) => widget !== 'weather');
            setWidgets(newWidgets);
          }}
        /> Meteo
      </div>

      <h3>Integrazioni</h3>
      <label>
        <input
          type="checkbox"
          checked={integrations.googleDrive}
          onChange={(e) =>
            setIntegrations({ ...integrations, googleDrive: e.target.checked })
          }
        />
        Google Drive
      </label>
      <label>
        <input
          type="checkbox"
          checked={integrations.email}
          onChange={(e) =>
            setIntegrations({ ...integrations, email: e.target.checked })
          }
        />
        Email
      </label>
      <label>
        <input
          type="checkbox"
          checked={integrations.calendar}
          onChange={(e) =>
            setIntegrations({ ...integrations, calendar: e.target.checked })
          }
        />
        Calendario
      </label>

      <button type="submit">Salva Preferenze</button>
    </form>
  );
};

export default PreferencesForm;
