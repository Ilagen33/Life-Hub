import express from 'express';
import Finance from '../models/Finance.js';
import { protect } from '../middleware/authMiddleware.js'; // Middleware di autenticazione

const router = express.Router();

// Aggiungere una nuova entrata o spesa
router.post('/add', protect, async (req, res) => {
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
    res.status(201).json(savedFinance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio della transazione.' });
  }
});

router.put('/update/:id', protect, async (req, res) => {
    const { type, category, amount, note } = req.body;
  
    try {
        
      const finance = await Finance.findById(req.params.id);
      if (!finance || finance.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ error: 'Transazione non trovata o non autorizzato.' });
      }
  
      finance.type = type || finance.type;
      finance.category = category || finance.category;
      finance.amount = amount || finance.amount;
      finance.note = note || finance.note;
  
      const updatedFinance = await finance.save();
      res.status(200).json(updatedFinance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento della transazione.' });
    }
  });
  

// Ottenere tutte le spese e le entrate di un utente
router.get('/', protect, async (req, res) => {
  try {
    //PAGINAZIONE
    const page = parseInt(req.query.page) || 1;
    const limite = parseInt(req.query.limit) || 10;
    const ordinamento = req.query.sort || "dueDate";
    const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
    const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente

    // FILTRI
    const filter = {};
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

    res.status(200).json({
        finances: finances,
        currentPage: currentPage,
        totalPages: Math.ceil(totale/limite), //ceil approssima per eccesso, il rapporto tra il totale degli elementi e il limite delle pagine, in questo modo ottengo il numero di pagine totali
        totalTasks: totale,
        message: "Finanze recuperate con successo"
    });
  } catch (error) {
    console.error(error);
    next(error);  }
});

// Cancellare una transazione
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance || finance.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Transazione non trovata o non autorizzato.' });
    }

    await finance.remove();
    res.status(200).json({ message: 'Transazione eliminata con successo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la cancellazione della transazione.' });
  }
});

export default router;
