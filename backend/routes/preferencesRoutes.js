import express from 'express';
import UserPreferences from '../models/UserPreferences.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Middleware di autenticazione
import validateObjectId from '../middlewares/ValidateId.js';

const router = express.Router();

// Recuperare le preferenze dell'utente
router.get(
  '/Preferences', 
  authMiddleware, 
  async (req, res, next) => {
    try {
      const preferences = await UserPreferences.findOne({ user: req.user._id });
      res.
        status(200)
        .json({
          preferences,
          message: 'Preferenze recuperate con successo.'
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Aggiornare le preferenze dell'utente
router.put(
  '/Preferences/:id', 
  [
    body("theme")
      .isString()
      .optional(),

    body("widgets")
      .isArray()
      .optional(),

    body("integrations")
      .isArray()
      .optional(),

    body("email")
      .isEmail()
      .optional(),

    body("calendar")
      .isBoolean()
      .optional(),
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
      const updatePreferences = await UserPreferences.findByIdAndUpdate(
        { _id: id, user: req.user._id },
        update,
        { new: true, upsert: true }
      );

      res
        .status(200)
        .json({
          updatePreferences,
          message: 'Preferenze aggiornate con successo.'
        });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
