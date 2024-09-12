//Preferences.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import Widget from './Widget'; // Componente per i widget personalizzati
import { useAuth } from '../../context/AuthContext.js' // Assumi di avere un contesto di autenticazione

const Preference = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [preferences, setPreferences] = useState(null);
  const [layout, setLayout] = useState('default');
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axiosInstance.get('/Preferences', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          },
        });
        setPreferences(response.data);
        setLayout(response.data.dashboardLayout);
        setWidgets(response.data.widgets);
      } catch (error) {
        console.error('Errore durante il recupero delle preferenze:', error);
      }
    };
    if(authToken){
      fetchPreferences();
    }
  }, [authToken]);

  return (
    <div className={`dashboard ${layout}`}>
      <h2>Dashboard</h2>
      {widgets.map((widget) => (
        <Widget key={widget} type={widget} />
      ))}
    </div>
  );
};

export default Preference;
