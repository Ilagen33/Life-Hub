import express from 'express';
import Finance from '../models/Finance.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Middleware di autenticazione
import validateObjectId from '../middlewares/ValidateId.js';

const router = express.Router();

// Aggiungere una nuova entrata o spesa
router.post(
  '/finance', 
  [
    body('title')
      .isString()
      .notEmpty()
      .withMessage('Il titolo è obbligatorio.')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Il titolo deve essere lungo almeno 3 caratteri.')
      .isLength({ max: 50 })
      .withMessage('Il titolo non può essere più lungo di 50 caratteri.'),

    body('type')
      .isIn(['income', 'expense', 'investment', 'debt', 'savings', 'other', 'salary', 'bonus', 'gift', 'refund', 'transfer', 'loan', 'credit', 'payment', 'withdrawal', 'deposit',])
      .withMessage('Il tipo di transazione non è valido.')
      .trim()
      .notEmpty(),

    body('amount')
      .isNumeric()
      .notEmpty()
      .withMessage('Il campo "amount" è obbligatorio.')
      .isLength({ max: 1000000000 })
      .withMessage('Il campo "amount" non può essere più lungo di 1000000000.')
      .isLength({ min: 1 })
      .withMessage('Il campo "amount" deve essere almeno 1.'),

    body('category')
      .isString()
      .notEmpty()
      .withMessage('Il campo "category" è obbligatorio.') 
      .trim()
      .isLength({ max: 50 })
      .withMessage('Il campo "category" non può essere più lungo di 50 caratteri.')
      .isLength({ min: 3 })
      .withMessage('Il campo "category" deve essere almeno 3 caratteri.'),

    body('date')
      .isDate()
      .notEmpty()
      .withMessage('Il campo "date" è obbligatorio.'),

      body('note')
      .isString()
      .notEmpty()
      .withMessage('Il campo "note" è obbligatorio.')
      .trim()
      .isLength({ max: 500 })
      .withMessage('Il campo "note" non può essere più lungo di 500 caratteri.')
      .isLength({ min: 3 })
      .withMessage('Il campo "note" deve essere almeno 3 caratteri.'),

  ],
  authMiddleware, 
  async (req, res) => {
    const { type, category, amount, note } = req.body;
  
    try {
      const newFinance = new Finance({
        user: req.user._id,
        type,
        category,
        amount,
        note,
      });

      const savedFinance = await newFinance.save();
      res
        .status(201)
        .json(savedFinance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio della transazione.' });
  }
});

router.put(
  '/update/:id',
  [
    body('title')
      .isString()
      .notEmpty()
      .withMessage('Il titolo è obbligatorio.')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Il titolo deve essere lungo almeno 3 caratteri.')
      .isLength({ max: 50 })
      .withMessage('Il titolo non può essere più lungo di 50 caratteri.'),

    body('type')
      .isIn(['income', 'expense', 'investment', 'debt', 'savings', 'other', 'salary', 'bonus', 'gift', 'refund', 'transfer', 'loan', 'credit', 'payment', 'withdrawal', 'deposit',])
      .withMessage('Il tipo di transazione non è valido.')
      .trim()
      .notEmpty(),

    body('amount')
      .isNumeric()
      .notEmpty()
      .withMessage('Il campo "amount" è obbligatorio.')
      .isLength({ max: 1000000000 })
      .withMessage('Il campo "amount" non può essere più lungo di 1000000000.')
      .isLength({ min: 1 })
      .withMessage('Il campo "amount" deve essere almeno 1.'),

    body('category')
      .isString()
      .notEmpty()
      .withMessage('Il campo "category" è obbligatorio.') 
      .trim()
      .isLength({ max: 50 })
      .withMessage('Il campo "category" non può essere più lungo di 50 caratteri.')
      .isLength({ min: 3 })
      .withMessage('Il campo "category" deve essere almeno 3 caratteri.'),

    body('date')
      .isDate()
      .notEmpty()
      .withMessage('Il campo "date" è obbligatorio.'),

      body('note')
      .isString()
      .notEmpty()
      .withMessage('Il campo "note" è obbligatorio.')
      .trim()
      .isLength({ max: 500 })
      .withMessage('Il campo "note" non può essere più lungo di 500 caratteri.')
      .isLength({ min: 3 })
      .withMessage('Il campo "note" deve essere almeno 3 caratteri.'),

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
      const allowedUpdates = ['title', 'type', 'category', 'amount', 'date', 'note'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

      if (!isValidOperation) {
          return res.status(400).json({ message: "Aggiornamento non valido!" });
      } 

      const { id } = req.params;
      const update = req.body;

    try {
      const updatedFinance = await Task.findByIdAndUpdate(
        {_id: id, user: req.user._id},
        update,
        { new: true, runValidators: true}
    );

    if(!updatedFinance) {
        return res
            .status(404)
            .json({
                message: "Task da aggiornare non presente o non trovato"
            });
    };

    res
        .json({
            updatedFinance,
            message: "Task Aggiornato!!"
        });

    } catch (error) {
      next(error);
    }
  });
  

// Ottenere tutte le spese e le entrate di un utente
router.get(
  '/finance', 
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
        filter.title = req.query.title; // Filtra per status (ad es., "completed", "pending")
      }
      if (req.query.amount) {
        filter.amount = req.query.amount; // Filtra per status (ad es., "completed", "pending")
      }
      if (req.query.category) {
        filter.category = req.query.category; // Filtra per categoria (ad es., "work", "personal")
      }
      if (req.query.date) {
        filter.date = new Date(req.query.date); // Filtra per data di scadenza
      }
      if (req.query.type) {
        filter.type = new type(req.query.date); // Filtra per data di scadenza
      }
      const finances = await Finance.find({
        user: req.user._id,
        ...filter,
      })
        .sort({ [ordinamento]: direzOrdine })
        .skip(salta)
        .limit(limite);

      const totale = await Finance.countDocuments({user: req.user._id});

      res
        .status(200)
        .json({
          finances: finances,
          currentPage: currentPage,
          totalPages: Math.ceil(totale/limite), //ceil approssima per eccesso, il rapporto tra il totale degli elementi e il limite delle pagine, in questo modo ottengo il numero di pagine totali
          totalTasks: totale,
          message: "Finanze recuperate con successo"
        });
    } catch (error) {
      console.error(error);
      next(error);  }
  }
);

// Cancellare una transazione
router.delete(
  '/finance/:id', 
  authMiddleware, 
  validateObjectId,
  async (req, res) => {
    try {
      const finance = await Finance.findById(req.params.id);
      if (!finance || finance.user.toString() !== req.user._id.toString()) {
        return res
          .status(404)
          .json({ error: 'Transazione non trovata o non autorizzato.' });
      }

      await finance.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ message: 'Transazione eliminata con successo.' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
