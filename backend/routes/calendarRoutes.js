import express from 'express';
import CalendarEvent from '../models/CalendarEvent.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Aggiungi un nuovo evento al calendario
router.post('/add', protect, async (req, res) => {
  const { title, description, startDate, endDate, reminders, category, allDay } = req.body;

  try {
    const newEvent = new CalendarEvent({
      user: req.user._id,
      title,
      description,
      startDate,
      endDate,
      reminders,
      category,
      allDay,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio dell\'evento.' });
  }
});

// Recupera tutti gli eventi di un utente
router.get('/', protect, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ user: req.user._id }).sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero degli eventi.' });
  }
});

// Modifica un evento esistente
router.put('/edit/:id', protect, async (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;

  try {
    const event = await CalendarEvent.findByIdAndUpdate(id, updatedEvent, { new: true });
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: 'Evento non trovato.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento dell\'evento.' });
  }
});

// Elimina un evento
router.delete('/delete/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    const event = await CalendarEvent.findByIdAndDelete(id);
    if (event) {
      res.status(200).json({ message: 'Evento eliminato con successo.' });
    } else {
      res.status(404).json({ error: 'Evento non trovato.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'evento.' });
  }
});

export default router;
