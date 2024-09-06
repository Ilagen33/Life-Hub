import express from 'express';
import MindfulnessExercise from '../models/MindfulnessExercise.js';
import { protect } from '../middleware/authMiddleware.js';
import CompletedMindfulness from '../models/CompletedMindfulness.js';

const router = express.Router();

// Ottenere tutti gli esercizi di mindfulness
router.get('/', protect, async (req, res) => {
  try {
    const exercises = await MindfulnessExercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero degli esercizi di mindfulness.' });
  }
});

// Aggiungere un esercizio completato per l'utente (tracciamento)
router.post('/complete/:id', protect, async (req, res) => {
    try {
      const exerciseId = req.params.id;
      const completed = new CompletedMindfulness({
        user: req.user._id,
        exercise: exerciseId,
      });
      await completed.save();
      res.status(200).json({ message: 'Esercizio completato!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante il tracciamento dell\'esercizio.' });
    }
  });

export default router;
