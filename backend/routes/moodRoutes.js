import express from "express";
import MoodTracker from "../models/MoodTracker.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { query, body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
    "/MoodTracker", 
    [
        body("mood")
            .notEmpty()
            .withMessage("Mood is required")
            .isIn(["happy", "sad", "angry", "neutral", "excited", "bored", "stressed", "anxious", "calm", "tired", "relaxed", "frustrated"])
            .withMessage("Invalid mood"),

        body("intensity")
            .isInt({ min: 1, max: 10 })
            .withMessage("Intensity must be between 1 and 10")
            .notEmpty()
            .withMessage("Intensity is required"),

        body("date")
            .isDate()
            .withMessage("Invalid date format")
            .notEmpty()
            .withMessage("Date is required"),

        body("notes")
            .isLength({ max: 1000 })
            .withMessage("Notes must be less than 1000 characters")
            .optional()
            .isString()
            .withMessage("Notes must be a string")
            .trim(),
    ],
    authMiddleware, 
    async (req, res) => {
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
            const Mood = new MoodTracker({
                user: req.user._id,
                ...req.body
            });

            const savedMoodTracker = await Mood.save();
            res.
                status(201)
                .json({
                    savedMoodTracker,
                    message: "MoodTracker created successfully"
                });
        } catch (err) {
            next(err);
        }
    }
);

router.get(
    "/MoodTracker", 
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
            if (req.query.mood) {
                filter.mood = req.query.mood; // Filtra per status (ad es., "completed", "pending")
            }
            if (req.query.intensity) {
                filter.intensity = req.query.intensity; // Filtra per categoria (ad es., "work", "personal")
            }
            if (req.query.date) {
                filter.date = new Date(req.query.date); // Filtra per data di scadenza
            }
            

            // QUERY AL DATABASE CON FILTRI, ORDINAMENTO E PAGINAZIONE
            //Nella query al database sono integrati: filtri, ordinamento e paginazione
            const moodTracker = await MoodTracker.find({
                user: req.user._id, 
                ...filter
            })
                .sort({ [ordinamento]: direzOrdine })
                .skip(salta)
                .limit(limite);

            const totale = await MoodTracker.countDocuments({user: req.user._id});

            res
                .status(200)
                .json({
                    moodTracker: moodTracker,
                    currentPage: page,
                    totalPages: Math.ceil(totale / limite),
                    totalItems: totale,
                    message: "MoodTracker retrieved successfully"
                });
        } catch (err) {
            next(err);
        }
    }
);

export default router;