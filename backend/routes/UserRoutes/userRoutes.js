//userRoutes.js
import express from "express";
import { query, body, validationResult } from 'express-validator';
import { loginUser, registerUser } from "../../controllers/userController.js";
import rateLimit from 'express-rate-limit';
import passport from "../../config/passportConfig.js";
const router = express.Router();

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 5, // Limita a 5 tentativi di login per IP per finestra
    message: 'Troppi tentativi di accesso, riprova più tardi.',
});

router.post(
    "/register",
    [
        body("username")
            .notEmpty()
            .withMessage("Il nome utente è obbligatorio")
            .isLength({ max:50 })
            .withMessage("Il nome utente non può superare i 50 caratteri")
            .trim()
            .escape(),

        body("email")
            //Rimozione di punti nel nome utente, conversione in minuscolo, rimozione di alias
            //Utile ad archiviare email in un database in un formato standard, 
            //per evitare la registrazione di utenti diversi con varianti dello stesso indirizzo email, 
            //confrontare email provenienti da diverse fonti per verificare se appartengono allo stesso utente
            .isEmail()
            .withMessage("Inserisci un indirizzo email valido")
            .trim()
            .normalizeEmail(),

        body("password")
            .isLength( {min: 8} )
            .withMessage("La password deve avere almeno 8 caratteri")
            .matches(/\d/)
            .withMessage("La password deve contenere almeno un numero"),

        body("confirmPassword")
            .custom((value, {req }) => {
                if(value !== req.body.password) {
                    throw new Error("Le password non coincidono");
                }
                return true;
            }),     
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
    registerUser,
);

router.post(
    "/login",
    loginRateLimiter,
    [
        body("email")
            .isEmail()
            .withMessage("Inserisci un indirizzo email valido")
            .trim()
            .normalizeEmail(),

        body("password")
            .notEmpty()
            .withMessage("La password è obbligatoria")
     
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res
                .status(400)
                .json({errors: errors.array()})
        }
        next();
    },
    loginUser,
);

router.get(
    "/google",
    passport
        .authenticate(
            "google", 
            { scope: 
                [
                    "profile",
                     "email"
                ] 
            }
        )
);

router.get(
    "/google/callback",
    passport
        .authenticate(
            "google",
            {
                failureRedirect: 
                "/login"
            }
        ),

    async(req, res, next) => {
        try {
            const token = await generateJWT({id: req.user._id});
            res.redirect(`http://localhost:3000/login?token=${token}`);
        } catch (error) {
            next(error);
        }
    }
);

export default router;

