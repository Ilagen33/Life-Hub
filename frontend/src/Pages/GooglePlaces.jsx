//GooglePlaces.jsx
import React, { useState } from 'react';
import axios from 'axios';

const GooglePlacesSearch = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('40.730610,-73.935242'); // Puoi cambiarlo con la tua posizione
  const [radius, setRadius] = useState(5000); // Raggio di ricerca in metri (es. 5 km)
  const [places, setPlaces] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get('/api/places', {
        params: { query, location, radius },
      });
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Cerca Luoghi su Google Places</h1>
      <input
        type="text"
        placeholder="Cosa stai cercando? (es. ristoranti, musei)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Cerca</button>

      <div>
        {places.length > 0 ? (
          <ul>
            {places.map((place, index) => (
              <li key={index}>
                <h3>{place.name}</h3>
                <p>{place.formatted_address}</p>
                <p>Rating: {place.rating}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun luogo trovato.</p>
        )}
      </div>
    </div>
  );
};

export default GooglePlacesSearch;
