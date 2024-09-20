import express from "express";
import Task from "../models/Task.js"
import mongoose from 'mongoose';
import validateObjectId from "../middlewares/ValidateId.js";
import authMiddleware from '../middlewares/authMiddleware.js'; // Importa il middleware

const router = express.Router();
import { query, body, validationResult } from 'express-validator';

router.get(

    "/task",

    [
        // Validazione e sanitizzazione dei parametri di query
        //Con la libreria 'express-validator', i parametri di query vengono controllati per assicurarsi che contengano valori corretti e attesi
        //Verranno rimossi spazi indesiderati e neutralizzati eventuali caratteri speciali dannosi, prevenendo attacchi come l'injection di codice
        //Se i parametri non soddisfano i criteri di validazione, un messagggio di errore dettagliato viene restituito all'utente, evitando che richieste malformate o non sicure raggiungano la logica principale
        query('status')
            .optional()
            .isIn(['completed', 'pending', 'in-progress'])
            .withMessage('Valore dello status non valido'),

        query('category')
            .optional()
            .isString()
            .trim()
            .escape()
            .withMessage('Valore della categoria non valido'),

        query('dueDate')
            .optional()
            .isISO8601()
            .toDate()
            .withMessage('Formato della data non valido'),

        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Il numero della pagina deve essere un numero intero positivo'),

        query('limit')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Il limite deve essere un numero intero positivo'),

        query('sortDirection')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage("Valore dell'ordinamento non valido"),

        query('sort')
            .optional()
            .isIn(['title', 'dueDate', 'status'])
            .withMessage('Campo di ordinamento non valido'),
    ],
    (req, res, next) => {

        // Verifica se ci sono errori di validazione
        const errors = validationResult(req);
        
        //La funzione isEmpty() è un metodo di validazione fornito dalla libreria express-validator
        //che serve a verificare se un campo di input è vuoto
        if (!errors.isEmpty()) {

          return res
            .status(400)
            .json({ 
                errors: errors.array() 
            });
        }
        next();
    },
    authMiddleware,
    async (req, res, next) => {
        console.log("Utente autenticato ID:", req.user._id);

        try {
            //PAGINAZIONE
            const page = parseInt(req.query.page) || 1;
            const limite = parseInt(req.query.limit) || 10;
            const ordinamento = req.query.sort || "dueDate";
            const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
            const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
        
            // FILTRI
            const filter = {};
            if (req.query.status) {
                filter.status = req.query.status; // Filtra per status (ad es., "completed", "pending")
            }
            if (req.query.category) {
                filter.category = req.query.category; // Filtra per categoria (ad es., "work", "personal")
            }
            if (req.query.dueDate) {
                filter.dueDate = new Date(req.query.dueDate); // Filtra per data di scadenza
            }

            // QUERY AL DATABASE CON FILTRI, ORDINAMENTO E PAGINAZIONE
            //Nella query al database sono integrati: filtri, ordinamento e paginazione
            const tasks = await Task.find({
                user: req.user._id, 
                ...filter
            })
                .sort({ [ordinamento]: direzOrdine })
                .skip(salta)
                .limit(limite);

            const totale = await Task.countDocuments({user: req.user._id});

            res
                .json({
                    tasks: tasks,
                    currentPage: page,
                    totalPages: Math.ceil(totale/limite), //ceil approssima per eccesso, il rapporto tra il totale degli elementi e il limite delle pagine, in questo modo ottengo il numero di pagine totali
                    totalTasks: totale,
                    message: "Tasks caricati con successo"
                });

        } catch (err) {
            next(err); 
        }
});

// Rotta per ottenere un'attività specifica
router.get(
    '/task/:id', 
    validateObjectId,
    authMiddleware,
    async (req, res, next) => {

        try {

            const task = await Task.findById(req.params.id);

            if (!task) {
                const error = new Error('Task non trovato');
                error.statusCode = 404;
                return next(error);
            }
            res
                .json({
                    task,
                    message: "Task caricato con successo"
                });
      
        } catch (err) {
            next(err);
        }
    }
);

// Rotta per creare una nuova attività
router.post(
    '/task',
    [
        body('title')
            .notEmpty()
            .withMessage('Il titolo è obbligatorio')
            .trim()
            .isLength({ max: 100 })
            .withMessage('Il contenuto non può superare i 100 caratteri')
            .escape(),

        body('dueDate')
            .optional()
            .isISO8601()
            .withMessage('Il formato della data non è valido'),

        body('status')
            .notEmpty()
            .isIn(['completed', 'pending', 'in-progress'])
            .withMessage('Status non valido'),

        body('category')
            .optional()
            .isString()
            .trim()
            .escape()
            .withMessage('Categoria non valida'),

        body('content')
            .notEmpty()
            .withMessage('Il contenuto è obbligatorio')
            .trim()
            .isLength({ max: 2500 })
            .withMessage('Il contenuto non può superare i 2500 caratteri')
    ],
    (req, res, next) => {

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
    },
    authMiddleware,
    async (req, res, next) => {
        try {
            const newTask = new Task({
                user: req.user.id,
                ...req.body,
            });
            const savedTask = await newTask.save();

            res
                .status(201).json({
                    savedTask,
                    message:"Nuovo Task Aggiunto!!" 
                });

    } catch (err) {
        next(err);
    }
});

// Rotta per aggiornare un'attività
router.put(
    '/task/:id',
    [
      body('title')
        .optional()
        .isString()
        .trim()
        .escape()
        .withMessage('Il titolo deve essere una stringa valida'),
  
      body('status')
        .optional()
        .isIn(['completed', 'pending', 'in-progress'])
        .withMessage('Lo status deve essere uno dei seguenti valori: completed, pending, in-progress'),
  
      body('category')
        .optional()
        .isString()
        .trim()
        .escape()
        .withMessage('La categoria deve essere una stringa valida'),
  
      body('dueDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Il formato della data non è valido'),
  
      body('content')
        .optional()
        .trim()
        .isLength({ max: 2500 })
        .withMessage('Il contenuto non può superare i 2500 caratteri')
    ],
    validateObjectId,
    authMiddleware,
    async (req, res, next) => {
      // Verifica se ci sono errori di validazione
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Verifica se almeno un campo è stato fornito
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Nessun dato fornito per l\'aggiornamento' });
      }
  
      // Filtra le proprietà non desiderate dal corpo della richiesta
      const allowedUpdates = ['title', 'status', 'category', 'dueDate', 'content', 'tags', 'priority'];
      const updates = Object.keys(req.body);
  
      // Rimuovi qualsiasi proprietà non consentita da `req.body`
      const filteredUpdates = updates.reduce((acc, update) => {
        if (allowedUpdates.includes(update)) {
          acc[update] = req.body[update];
        }
        return acc;
      }, {});
  
      // Se non rimane nulla da aggiornare dopo il filtraggio
      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({ message: 'Nessun campo valido fornito per l\'aggiornamento' });
      }
  
      const { id } = req.params;
  
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          { _id: id, user: req.user._id },
          filteredUpdates, // Usa solo i campi filtrati
          { new: true, runValidators: true }
        );
  
        if (!updatedTask) {
          return res.status(404).json({ message: 'Task da aggiornare non presente o non trovato' });
        }
  
        res.json({ 
            task: updatedTask, 
            message: 'Task Aggiornato!!' 
        });
      } catch (err) {
        next(err);
      }
    }
  );
  

// Rotta per cancellare un'attività
router.delete(
    '/task/:id',
    validateObjectId,
    authMiddleware,
    async (req, res, next) => {

    const { id } = req.params;
    try {

        const deletedTask = await Task.findById({_id: id, user: req.user.id});

        if(!deletedTask) {
               res
                 .status(404)
                  .json({
                      message: "Task da eliminare non presente o non trovato"
                  })                
        }

        await Task.findByIdAndDelete(req.params.id);

        res
            .status(200)        
            .json({
                message: "Task Eliminato!!"
            });
            
        } catch (err) {
            next(err);
        }
});

export default router;