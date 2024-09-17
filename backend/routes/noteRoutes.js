import express from 'express';
import Note from '../models/Note.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Middleware di autenticazione
import validateObjectId from '../middlewares/ValidateId.js';
import { query, body, validationResult } from 'express-validator';

const router = express.Router();

// Aggiungi un nuovo appunto
router.post(
  '/Notes',
  [
    body('title')
      .notEmpty()
      .withMessage('Il titolo è obbligatorio.')
      .isString()
      .withMessage('Il titolo deve essere una stringa.')
      .isLength({ min: 3 })
      .withMessage('Il titolo deve essere lungo almeno 3 caratteri.')
      .isLength({ max: 100 })
      .withMessage('Il titolo non può superare i 50 caratteri.')
      .trim(),

    body('content')
      .notEmpty()
      .withMessage('Il contenuto è obbligatorio.')
      .isString()
      .withMessage('Il contenuto deve essere una stringa.')
      .isLength({ min: 3 })
      .withMessage('Il contenuto deve essere lungo almeno 3 caratteri.')
      .isLength({ max: 1000 })
      .withMessage('Il contenuto non può superare i 1000 caratteri.')
      .trim(),

    body('tags')
      .optional()
      .isArray()
      .withMessage('I tag devono essere un array.')
      .custom((tags) => {
        if (tags && tags.some((tag) => typeof tag !== 'string')) {
          throw new Error('I tag devono essere stringhe.');
        }
        return true;
      }),

    body('category')
      .optional()
      .isString()
      .withMessage('La categoria deve essere una stringa.')
      .isLength({ max: 50 })
      .withMessage('La categoria non può superare i 50 caratteri.')
      .trim(),

  ],
  authMiddleware,
  async (req, res, next) => {
    // Verifica se ci sono errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newNote = new Note({
        user: req.user._id,
        ...req.body,
      });

      const savedNote = await newNote.save();
      res.status(201).json({
        savedNote,
        message: 'Appunto aggiunto con successo.',
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Recupera tutti gli appunti di un utente
router.get(
  '/Notes', 
  authMiddleware, 
  async (req, res) => {
    try {
      //PAGINAZIONE
      const page = parseInt(req.query.page) || 1;
      const limite = parseInt(req.query.limit) || 10;
      const ordinamento = req.query.sort || "dueDate";
      const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
      const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
  
      // FILTRI
      const filter = {};
      if (req.query.title) {
          filter.title = req.query.title; // Filtra per title (ad es., "completed", "pending")
      }
      if (req.query.tags) {
          filter.tags = req.query.tags; // Filtra per categoria (ad es., "work", "personal")
      }
      if (req.query.category) {
          filter.category = new Date(req.query.category); // Filtra per data di scadenza
      }
      const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante il recupero degli appunti.' });
    }
  }
);

// Modifica un appunto
router.put(
  '/Notes/:id',
  [
    body('title')
      .notEmpty()
      .withMessage('Il titolo è obbligatorio.')
      .isString()
      .withMessage('Il titolo deve essere una stringa.')
      .isLength({ min: 3 })
      .withMessage('Il titolo deve essere lungo almeno 3 caratteri.')
      .isLength({ max: 100 })
      .withMessage('Il titolo non può superare i 50 caratteri.')
      .trim(),

    body('content')
      .notEmpty()
      .withMessage('Il contenuto è obbligatorio.')
      .isString()
      .withMessage('Il contenuto deve essere una stringa.')
      .isLength({ min: 3 })
      .withMessage('Il contenuto deve essere lungo almeno 3 caratteri.')
      .isLength({ max: 1000 })
      .withMessage('Il contenuto non può superare i 1000 caratteri.')
      .trim(),

    body('tags')
      .optional()
      .isArray()
      .withMessage('I tag devono essere un array.')
      .custom((tags) => {
        if (tags && tags.some((tag) => typeof tag !== 'string')) {
          throw new Error('I tag devono essere stringhe.');
        }
        return true;
      }),

    body('category')
      .optional()
      .isString()
      .withMessage('La categoria deve essere una stringa.')
      .isLength({ max: 50 })
      .withMessage('La categoria non può superare i 50 caratteri.')
      .trim(),

  ],
  authMiddleware,
  validateObjectId,
  async (req, res, next) => {
    // Verifica se ci sono errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ 
                errors: errors.array() 
            });
    }

    // Verifica se almeno un campo è stato fornito
    //Object.keys() è un metodo JavaScript che restituisce un array contenente tutte le chiavi enumerabili di un oggetto
    //Quindi se il corpo della richiesta non inserisce nessuna proprietà dell'oggetto restituisce errore
    if (Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ 
                message: "Nessun dato fornito per l'aggiornamento"
            });
    }
    // Controlli a livello di applicazione
    //Ci assicuriamo che le modifiche siano consentite
    
    const allowedUpdates = ['title', 'status', 'category', 'dueDate', 'content'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: "Aggiornamento non valido!" });
    }

    const { id } = req.params;
    const update = req.body;
    try {
      const updateNote = await Note.findByIdAndUpdate(
        {_id: id, user: req.user._id},
        updateNote, 
        { new: true, runValidators: true}
      );
      if (!updateNote) {
        return res
          .status(404)
          .json({
            message: 'Appunto non trovato.'
          });
      };

      res
        .status(200)
        .json({
          message: 'Appunto modificato con successo.',
          updateNote,
        });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Elimina un appunto
router.delete(
  '/Notes/:id', 
  authMiddleware, 
  validateObjectId,
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const deleteNote = await Note.findById({
        _id: id,
        user: req.user._id
      });

      if (!deleteNote) {
        res
          .status(404)
          .json({ 
            message: 'Appunto eliminato con successo.' 
          });
        }

      await Note.findByIdAndDelete(req.params.id);

      res
        .status(200)
        .json({ 
          message: 'Appunto eliminato con successo.' 
        });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
