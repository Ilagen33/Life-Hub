import express from "express";
import User from "../../models/User.js";

import {validationResult} from 'express-validator/lib/validation-result.js';
import {body} from "express-validator";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { deleteUser, updateUser, refreshAccessToken } from "../../controllers/userController.js";
import validateObjectId from "../../middlewares/ValidateId.js";

const router = express.Router();

router.get(
    `/me/:id`, 
    authMiddleware,
    validateObjectId,
    async (req, res, next) => {

        try {

            const user = await User.findById(req.params.id);

            if (!user) {
                const error = new Error('User non trovato');
                error.statusCode = 404;
                return next(error);
            }

            res.json({
                user,
                message: "Utente caricato con successo"
            });

        } catch (err) {
            next(err);
        }
    }
)
router.put(
    '/me/:id',
    [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Inserisci un indirizzo email valido")
            .trim()
            .normalizeEmail(),
        body("password")
            .optional()
            .isLength({min: 8})
            .withMessage("La password deve avere almeno 8 caratteri")
            .matches(/\d/)
            .withMessage("La password deve contenere almeno un numero"),
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
    updateUser
)

router.delete(
    '/me/:id',
    authMiddleware,
    deleteUser
);

router.post('/refresh-token', refreshAccessToken);


export default router;