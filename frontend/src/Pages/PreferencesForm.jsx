//PreferencesForm.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const PreferencesForm = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [layout, setLayout] = useState('default');
  const [widgets, setWidgets] = useState([]);
  const [integrations, setIntegrations] = useState({
    googleDrive: false,
    email: false,
    calendar: false,
  });

  const [preferencesId, setPreferencesId] = useState(null); // Stato per memorizzare l'ID delle preferenze


  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axiosInstance.get('/Preferences', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          },
        });
        setLayout(response.data.dashboardLayout);
        setWidgets(response.data.widgets);
        setIntegrations(response.data.integrations);
        setPreferencesId(response.data._id); // Memorizza l'ID delle preferenze
      } catch (error) {
        console.error('Errore durante il recupero delle preferenze:', error);
      }
    };
    if(authToken) {
      fetchPreferences();
    }
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/Preferences/${preferencesId}`, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          },
        },
        { dashboardLayout: layout, widgets, integrations });
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
