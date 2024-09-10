import express from 'express';
import MindfulnessExercise from '../models/MindfulnessExercise.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import CompletedMindfulness from '../models/CompletedMindfulness.js';
import { query, body, validationResult } from 'express-validator';

const router = express.Router();

// Ottenere tutti gli esercizi di mindfulness
router.post(
  '/mindfulness',
  [
    body("title")
      .notEmpty()
      .withMessage("Il titolo è obbligatorio.")
      .isString()
      .withMessage("Il titolo deve essere una stringa.")
      .isLength({ max: 100 })
      .withMessage("Il titolo non può superare i 100 caratteri.")
      .trim(),

    body("tags")
      .isArray()
      .withMessage("I tag devono essere un array.")
      .notEmpty()
      .withMessage("I tag non possono essere vuoti."),

    body("category")
      .notEmpty()
      .withMessage("La categoria è obbligatoria.")
      .isString()
      .withMessage("La categoria deve essere una stringa.")
      .isLength({ max: 50 })
      .withMessage("La categoria non può superare i 50 caratteri.")
      .trim(),

    body("difficulty")
      .notEmpty()
      .withMessage("La difficoltà è obbligatoria.")
      .isString()
      .withMessage("La difficoltà deve essere una stringa.")
      .isLength({ max: 50 })
      .withMessage("La categoria non può superare i 50 caratteri.")
      .trim(),

    body("instructions")
      .notEmpty()
      .withMessage("Le istruzioni sono obbligatorie.")
      .isString()
      .withMessage("Le istruzioni devono essere una stringa.")
      .isLength({ max: 500 })
      .withMessage("Le istruzioni non possono superare i 500 caratteri.")
      .trim(),

    body("description")
      .notEmpty()
      .withMessage("La descrizione è obbligatoria.")
      .isString()
      .withMessage("La descrizione deve essere una stringa.")
      .isLength({ max: 2000 })
      .withMessage("La descrizione non può superare i 500 caratteri.")
      .trim(),

    body("duration")
      .notEmpty()
      .withMessage("La durata è obbligatoria.")
      .isNumeric()
      .withMessage("La durata deve essere un numero.")
      .isLength({ max: 60 })
      .withMessage("La durata non può superare i 50 caratteri.")
      .trim(),
  ],
  authMiddleware, 
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
        next();
    try {
      
      const exercises = new MindfulnessExercise({
        user: req.user._id,
        ...req.body,
      })
      const savedMindfulnessExercise = await MindfulnessExercise.save();
      res
        .status(201)
        .json({
          savedMindfulnessExercise,
          message: 'Esercizio di mindfulness salvato con successo.'
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Aggiungere un esercizio completato per l'utente (tracciamento)
router.get(
  '/mindfulness', 
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
      if (req.query.duration) {
        filter.duration = new Date(req.query.duration); // Filtra per data di scadenza
      }
      if (req.query.category) {
        filter.category = new Date(req.query.category); // Filtra per data di scadenza
      }
      if (req.query.difficulty) {
        filter.difficulty = new Date(req.query.difficulty); // Filtra per data di scadenza
      }
      if (req.query.description) {
        filter.description = new Date(req.query.description); // Filtra per data di scadenza
      }
      

      // QUERY AL DATABASE CON FILTRI, ORDINAMENTO E PAGINAZIONE
      //Nella query al database sono integrati: filtri, ordinamento e paginazione
      const mindfullExercises = await MindfulnessExercise.find({
        user: req.user._id, 
        ...filter
      })
        .sort({ [ordinamento]: direzOrdine })
        .skip(salta)
        .limit(limite);

      const totale = await MindfullExercises.countDocuments({user: req.user._id});
      res
        .status(200)
        .json({
          mindfullExercises: mindfullExercises,
          currentPage: page,
          totalPages: Math.ceil(totale / limite),
          totalItems: totale,
          message: "Esercizi caricati con successo"
        });

    } catch (error) {
      console.error(error);
      next(error);
    }
  });

export default router;
