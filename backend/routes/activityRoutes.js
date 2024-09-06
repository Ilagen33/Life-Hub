import express from "express";
import Activity from "../models/Activity.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { query, body, validationResult } from 'express-validator';
import validateObjectId from "../middlewares/ValidateId.js";

const router = express.Router();

router.post(
    "/activity",
    [
        body("title")
            .notEmpty()
            .withMessage("Il titolo è obbligatorio")
            .trim(),

        body("date")
            .optional(),

        body("status")
            .optional(),

        body("priority")
            .optional(),

        body("notes")
            .optional()
            .trim(),
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
            const activities = await Activity.find({ 
            userId: req.user._id,
             ...req.body 
            });
            const savedActivities = await activities.save();
            res
                .status(200)
                .json({
                    savedActivities,
                    message: "Attività salvata con successo"
                });
        } catch (error) {
            next(error)
        }
    }
);

router.get(
    "/activity",
    authMiddleware,
    async (req, res, next) => {
        try {

            //PAGINAZIONE
            const page = parseInt(req.query.page) || 1;
            const limite = parseInt(req.query.limit) || 10;
            const ordinamento = req.query.sort || "date";
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

            const activities = await Activity.find({ 
                userId: req.user._id,
                ...filter
            })
                .sort({ date: -1})
                .skip(salta)
                .limit(limite);
        
            const totale = await Task.countDocuments({user: req.user._id});

            res
                .status(200)
                .json({
                    activities: activities,
                    currentPage: page,
                    totalPages: Math.ceil(totale/limite), //ceil approssima per eccesso, il rapporto tra il totale degli elementi e il limite delle pagine, in questo modo ottengo il numero di pagine totali
                    totalActivities: totale,
                    message: "Activities caricati con successo"
                });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/activity/:id", 
    authMiddleware,
    validateObjectId,
    async (req, res) => {
        try {
            const activities = await Activity.findById(req.params.id);
            if (!activities || activities.user.toString() !== req.user._id.toString()) {
                return res
                    .status(404)
                    .json({ message: "Activity not found" });
            }
            res
                .status(200)
                .json({
                    activities,
                    message: "Activity caricato con successo"
                });
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    "/activity/:id",
    [
        body("title")
            .optional()
            .isString()
            .withMessage("Il titolo deve essere una stringa valida")
            .trim(),

        body("date")
            .optional(),

        body("status")
            .optional(),

        body("priority")
            .optional(),

        body("notes")
            .optional()
            .trim(),
    ],
    validateObjectId,
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

        if (!isValidOperation) {
            return res.status(400).json({ message: "Aggiornamento non valido!" });
        }
            
        try {

            const activities = await Activity.findById(req.params.id);
            if (!activities || activities.user.toString() !== req.user._id.toString()) {
                return res.status(404).json({ message: "Activity not found" });
            }
            const updatedActivities = await Activity
                .findByIdAndUpdate(
                    req.params.id, 
                    req.body, 
                    { 
                        new: true, 
                        runValidators: true
                    }
                );

            res
                .status(200)
                .json({
                    updatedActivities,
                    message: "Activity aggiornato con successo"
                });
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    "/activity/:id",
    validateObjectId,
    authMiddleware,
    async (req, res, next) => {
        try {
            const activities = await Activity.findById(req.params.id);
            if (!activities || activities.user.toString() !== req.user._id.toString()) {
                return res
                    .status(404)
                    .json({ message: "Activity not found" });
            }

            await activities.remove();
            res
                .status(200)
                .json({ message: "Activity deleted" });
                
    } catch (error) {
        next(error);
    }
});

export default router;

