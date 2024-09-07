import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Aggiungi un nuovo appunto
router.post('/add', protect, async (req, res) => {
  const { title, content, tags, category } = req.body;

  try {
    const newNote = new Note({
      user: req.user._id,
      title,
      content,
      tags,
      category,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante l\'aggiunta dell\'appunto.' });
  }
});

// Recupera tutti gli appunti di un utente
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero degli appunti.' });
  }
});

// Modifica un appunto
router.put('/edit/:id', protect, async (req, res) => {
  const { id } = req.params;
  const updatedNote = req.body;

  try {
    const note = await Note.findByIdAndUpdate(id, updatedNote, { new: true });
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ error: 'Appunto non trovato.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la modifica dell\'appunto.' });
  }
});

// Elimina un appunto
router.delete('/delete/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByIdAndDelete(id);
    if (note) {
      res.status(200).json({ message: 'Appunto eliminato con successo.' });
    } else {
      res.status(404).json({ error: 'Appunto non trovato.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'appunto.' });
  }
});

export default router;
