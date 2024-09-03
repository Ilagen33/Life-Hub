import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import taskRoutes from "./routes/taskRoutes.js"
import userRoutes from "./routes/UserRoutes/userRoutes.js"
import profileRoutes from "./routes/UserRoutes/profileRoutes.js"

import errorHandler from './middlewares/ErrorHandler.js';
import authMiddleware from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // Limita ogni IP a 100 richieste per finestra di 15 minuti
    message: 'Troppe richieste effettuate dal tuo IP, riprova più tardi.',
    standardHeaders: true, // Invia informazioni di rate limit nelle intestazioni
    legacyHeaders: false, // Disabilita le intestazioni "X-RateLimit-*"
});

const corsOptions = {
    origin: 'http://localhost:3000', // Solo le origini specificate sono permesse
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metodi HTTP permessi
    allowedHeaders: ['Content-Type', 'Authorization'], // Intestazioni permesse
    credentials: true, // Permetti l'uso dei cookie
};

const PORT = process.env.PORT || 5000;

app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
        },
    })
);

app.use(passport.initialize());

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("DB connesso"))
    .catch((err) => console.error("DB: errore nella connessione", err));

app.use("/api", taskRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes)

app.use(errorHandler);
app.use(authMiddleware);

app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}. Sono disponibili i seguenti endpoints:`);
    console.table(endpoints(app));
})