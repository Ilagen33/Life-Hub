import express from 'express';
import CalendarEvent from '../models/CalendarEvent.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateObjectId from '../middlewares/ValidateId.js';
import { query, body, validationResult } from 'express-validator';

const router = express.Router();

// Aggiungi un nuovo evento al calendario
router.post(
  '/calendar', 
  [
    body('title')
      .notEmpty()
      .withMessage('Il titolo è obbligatorio')
      .isString()
      .isLength({ max: 100 })
      .withMessage('Il titolo non può superare i 100 caratteri')
      .trim(),

    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('La descrizione non può superare i 500 caratteri')
      .trim(),
    
      body('startDate')
      .notEmpty()
      .withMessage('La data di inizio è obbligatoria')
      .isISO8601()
      .withMessage('La data di inizio deve essere una data valida'),

      body('endDate')
      .notEmpty()
      .withMessage('La data di fine è obbligatoria')
      .isISO8601()
      .withMessage('La data di fine deve essere una data valida'),

      body('reminders')
      .optional()
      .trim(),

      body('category')
      .optional()
      .trim(),

      body('allDay')
      .optional()
      .isBoolean()
      .withMessage('Il campo "allDay" deve essere un booleano'),
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

    try {
      const newEvent = new CalendarEvent({
        user: req.user._id,
        ...req.body
      });

      const savedEvent = await newEvent.save();
      res
        .status(201)
        .json({
          savedEvent,
          message: 'Evento aggiunto al calendario con successo'
        });
    } catch (error) {
      next(error);
    }
  }
);

// Recupera tutti gli eventi di un utente
router.get(
  '/calendar',
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
    if (req.query.category) {
        filter.category = req.query.category; // Filtra per categoria (ad es., "work", "personal")
    }
    if (req.query.startDate) {
        filter.startDate = new Date(req.query.startDate); // Filtra per data di scadenza
    }
    if (req.query.endDate) {
      filter.endDate = new Date(req.query.endDate); // Filtra per data di scadenza
  }

    const events = await CalendarEvent.find({ 
      user: req.user._id,
      ...filter 
    })
      .sort({ [ordinamento]: direzOrdine })
      .skip(salta)
      .limit(limite);

    const totalEvents = await CalendarEvent.countDocuments({user: req.user._id});

    res
      .status(200)
      .json({
        events: events,
        currentPage: page,
        totalPages: Math.ceil(totale/limite),
        totalEvents: totale,
        message: 'Eventi recuperati con successo',
      });

  } catch (error) {
    next(error);
  }
});

// Modifica un evento esistente
router.put(
  '/calendar/:id', 
  [
    body('title')
      .notEmpty()
      .withMessage('Il titolo è obbligatorio')
      .isString()
      .isLength({ max: 100 })
      .withMessage('Il titolo non può superare i 100 caratteri')
      .trim(),

    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('La descrizione non può superare i 500 caratteri')
      .trim(),
    
      body('startDate')
      .notEmpty()
      .withMessage('La data di inizio è obbligatoria')
      .isISO8601()
      .withMessage('La data di inizio deve essere una data valida'),

      body('endDate')
      .notEmpty()
      .withMessage('La data di fine è obbligatoria')
      .isISO8601()
      .withMessage('La data di fine deve essere una data valida'),

      body('reminders')
      .optional()
      .trim(),

      body('category')
      .optional()
      .trim(),

      body('allDay')
      .optional()
      .isBoolean()
      .withMessage('Il campo "allDay" deve essere un booleano'),
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
    };

    // Verifica se almeno un campo è stato fornito
    //Object.keys() è un metodo JavaScript che restituisce un array contenente tutte le chiavi enumerabili di un oggetto
    //Quindi se il corpo della richiesta non inserisce nessuna proprietà dell'oggetto restituisce errore
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ 
          message: "Nessun dato fornito per l'aggiornamento"
        });
    };

    // Controlli a livello di applicazione
    //Ci assicuriamo che le modifiche siano consentite
    const allowedUpdates = ['title', 'description', 'category', 'startDate', 'endDate', 'reminders', 'allDay'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res
        .status(400)
        .json({ message: "Aggiornamento non valido!" });
    }

    const { id } = req.params;
    const updatedEvent = req.body;

    try {
      const event = await CalendarEvent
        .findByIdAndUpdate(
          {
            _id: id,
            user: req.user._id,
          },
          updatedEvent,
          { 
            new: true,
            runValidators: true,
          }
        );

      if (event) {
        res
          .status(200)
          .json({
            event,
            message: 'Evento modificato con successo'
          });

      } else {
        res
          .status(404)
          .json({ error: 'Evento non trovato.' });
      }

    } catch (error) {
      next(error);
    }
  }
);

// Elimina un evento
router.delete(
  '/delete/:id',
  authMiddleware,
  validateObjectId,
  async (req, res, next) => {

    const { id } = req.params;

    try {

      const deletedTask = await CalendarEvent.findById({
        _id: id,
        user: req.user._id,
      });

      if(!deletedTask) {
        res
          .status(404)
          .json({ error: 'Evento non trovato.' });  
      }

      await CalendarEvent.findByIdAndDelete(req.params.id);

        res
          .status(200)
          .json({ message: 'Evento eliminato con successo.' });
      
    } catch (error) {
      next(error);
    }
  }
);

export default router;
