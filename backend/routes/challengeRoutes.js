import express from 'express';
import Challenge from '../models/Challenge';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddleware.js'; // Importa il middleware
import { query, body, validationResult } from 'express-validator';
import validateObjectId from "../middlewares/ValidateId.js";


// Aggiungi una nuova sfida
router.post(
  '/challenges',
  [
    body('title')
      .notEmpty()
      .isString()
      .withMessage('Il titolo della sfida è obbligatorio')
      .maxLength(100)
      .withMessage('Il titolo della sfida non può superare i 100 caratteri')
      .trim(),

    body('description')
      .notEmpty()
      .isString()
      .withMessage('La descrizione della sfida è obbligatoria')
      .maxLength(2500)
      .withMessage('La descrizione della sfida non può superare i 2500 caratteri')
      .trim(),

    body('points')
      .notEmpty()
      .isInt()
      .withMessage('I punti della sfida devono essere un numero intero compreso')
      .trim(),

    body('completed')
      .notEmpty()
      .isBoolean()
      .withMessage('La sfida deve essere completata o non completata')
      .trim(),
    
    body('date')
      .isDate()
      .withMessage('La data deve essere una data valida')
      .trim(),
  ],
  authMiddleware,
  async (req, res, next) => {
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
      const newChallenge = new Challenge({
        user: req.user._id,
        ...req.body,
      });

      const savedChallenge = await newChallenge.save();
      res
        .status(201)
        .json({
          savedChallenge,
          message: 'Sfida creata con successo'
      });

    } catch (err) {
      next(err);
    }
  }
);

// Ottieni tutte le sfide di un utente
router.get(
  '/challenges',
  authMiddleware,
  async (req, res, next) => {
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
      if (req.query.points) {
          filter.points = req.query.points; // Filtra per categoria (ad es., "work", "personal")
      }
      if (req.query.completed) {
          filter.completed = new Date(req.query.completed); // Filtra per data di scadenza
      }
      if (req.query.date) {
        filter.date = new Date(req.query.date); // Filtra per data di scadenza
    }
      const challenges = await Challenge.find({ 
        user: req.user._id,
        ...filter,
      })
        .sort({ [ordinamento]: direzOrdine })
        .skip(salta)
        .limit(limite);

      const totale = await Challenge.countDocuments({ user: req.user._id});
      
      res
        .status(200)
        .json({
          challenges: challenges,
          currentPage: page,
          totalPages: Math.ceil(totale / limite),
          totalItems: totale,
          message: 'Sfide caricate con successo'
        });

    } catch (err) {
      next(err);
    }
  }
);

// Marca una sfida come completata
router.put(
  '/challenges/:id',
  [
    body('title')
      .notEmpty()
      .isString()
      .withMessage('Il titolo della sfida è obbligatorio')
      .maxLength(100)
      .withMessage('Il titolo della sfida non può superare i 100 caratteri')
      .trim(),

    body('description')
      .notEmpty()
      .isString()
      .withMessage('La descrizione della sfida è obbligatoria')
      .maxLength(2500)
      .withMessage('La descrizione della sfida non può superare i 2500 caratteri')
      .trim(),

    body('points')
      .notEmpty()
      .isInt()
      .withMessage('I punti della sfida devono essere un numero intero compreso')
      .trim(),

    body('completed')
      .notEmpty()
      .isBoolean()
      .withMessage('La sfida deve essere completata o non completata')
      .trim(),
    
    body('date')
      .isDate()
      .withMessage('La data deve essere una data valida')
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
    const allowedUpdates = ['title', 'description', 'points', 'completed', 'date'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res
        .status(400)
        .json({ message: "Aggiornamento non valido!" });
    }

    const { id } = req.params;
    const update = req.body;
    

    try {
      const updatedChallenge = await Challenge.findByIdAndUpdate(
        {
          _id: id,
          user:req.params.id
        }, 
        update,
        { completed: true },
        { new: true }
      );

      res
        .status(200)
        .json({
          updatedChallenge,
          message: 'Sfida aggiornata con successo'
        });

    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/challenges/:id',
  authMiddleware,
  validateObjectId, 
  async (req, res, next) => {
    const { id } = req.params;
    try{
      const deleteChallenge = await Challenge.findById({
        _id: id,
        user: req.user._id
      });

      if(!deleteChallenge){
        res 
          .status(404)
          .json({
            message: 'Sfida non trovata'
          });
      }

      await Challenge.findByIdAndDelete(req.params.id);

      res
        .status(200)
        .json({
          message: 'Sfida eliminata con successo'
        });

    } catch (err) {
      next(err);
    }
  }
);


export default router;
