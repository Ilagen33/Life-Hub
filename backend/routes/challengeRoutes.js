import express from 'express';
import Challenge from '../models/Challenge';
const router = express.Router();

// Aggiungi una nuova sfida
router.post('/challenges', async (req, res) => {
  const { title, description, points } = req.body;
  try {
    const newChallenge = new Challenge({
      title,
      description,
      points,
      user: req.user._id,
    });
    const savedChallenge = await newChallenge.save();
    res.status(201).json(savedChallenge);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la creazione della sfida' });
  }
});

// Ottieni tutte le sfide di un utente
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find({ user: req.user._id });
    res.status(200).json(challenges);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il caricamento delle sfide' });
  }
});

// Marca una sfida come completata
router.put('/challenges/:id/complete', async (req, res) => {
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.status(200).json(updatedChallenge);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il completamento della sfida' });
  }
});

export default router;
