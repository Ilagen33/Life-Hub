//userRoutes.js
import express from "express";
import { query, body, validationResult } from 'express-validator';
import { loginUser, registerUser } from "../../controllers/userController.js";
import rateLimit from 'express-rate-limit';
import passport from "../../config/passportConfig.js";
const router = express.Router();
import authMiddleware from "../../middlewares/authMiddleware.js";
import upload from "../../middlewares/uploadImage.js";
import User from '../../models/User.js'; // Assicurati che questo percorso sia corretto

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

// Route per caricare la foto profilo su Cloudinary
router.post(
    '/uploadProfilePicture', 
    authMiddleware, 
    upload.single('media'), 
    async (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Errore: Nessun file caricato!' });
        }

        try {
            // Trova l'utente autenticato
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }

            // Aggiorna la foto profilo con l'URL dell'immagine caricata su Cloudinary
            user.avatar = req.file.path;
            await user.save();

            // Risposta con l'URL della nuova immagine del profilo
            res
                .status(200)
                .json({ 
                    message: 'Foto profilo aggiornata con successo', 
                    profileImage: user.avatar 
                });

        } catch (error) {
            next(error);    
        }
    }
);

export default router;

