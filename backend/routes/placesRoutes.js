import express from 'express';

const router = express.Router();

// Rotta per ottenere luoghi basati su query di ricerca (ad esempio, ristoranti, attrazioni)
router.get('/places', async (req, res) => {
  const { query, location, radius } = req.query;
  
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
      params: {
        query: req.query.query,
        location: req.query.location,
        radius: req.query.radius,   // raggio in metri, es: 5000 (5 km)
        key: process.env.GOOGLE_PLACES_API_KEY,
      }
    });

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero dei dati da Google Places.' });
  }
});

export default router;
