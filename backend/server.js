//server.js
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
import diaryRoutes from "./routes/diaryRoutes.js"
import activityRoutes from "./routes/activityRoutes.js"
import workoutPlanRoutes from "./routes/workoutPlanRoutes.js"
import healthRoutes from "./routes/healthRoutes.js"
import moodRoutes from "./routes/moodRoutes.js"
import placesRoutes from "./routes/placesRoutes.js"
import errorHandler from './middlewares/ErrorHandler.js';
import authMiddleware from './middlewares/authMiddleware.js';
import financeRoutes from './routes/financeRoutes.js';
import recipeRoutes from './routes/RecipeRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import preferencesRoutes from './routes/preferencesRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import mindfulnessRoutes from './routes/mindfulnessRoutes.js';
import morgan from 'morgan';
import cron from 'node-cron';
import sendReminderEmail from './services/emailService.js'; // Funzione di invio email
import User from './models/User.js'; // Modello utente

dotenv.config();


// Gestione delle eccezioni non catturate
process.on('uncaughtException', (err) => {
  console.error('Errore non catturato:', err);
  // Chiudi il processo con un codice di errore non-zero per indicare il fallimento
  process.exit(1); 
});

// Gestione delle promesse rifiutate senza catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rifiutata non gestita:', promise, 'Motivo:', reason);
  // Chiudi il processo per evitare comportamenti imprevedibili
  process.exit(1); 
});

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


// Imposta un cron job giornaliero per inviare promemoria alle 9:00
cron.schedule('0 9 * * *', async () => {
  try {
    const users = await User.find(); // Trova tutti gli utenti
    users.forEach(user => {
      sendReminderEmail(user.email, 'Promemoria Diario', 'Ricordati di aggiornare il tuo diario oggi!');
    });
    console.log('Promemoria inviati a tutti gli utenti.');
  } catch (err) {
    console.error('Errore durante l\'invio dei promemoria:', err);
  }
});

if (!process.env.DB_URI || !process.env.SESSION_SECRET) {
  console.error('DB_URI o SESSION_SECRET non sono definite nel file .env');
  process.exit(1); // Esci dal processo se le variabili sono mancanti
};

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



// Usa morgan per loggare tutte le richieste
app.use(morgan('dev'));

// Gestione degli errori
app.use(errorHandler);

// Rotte senza autenticazione (login, registrazione)
app.use("/api", userRoutes);  // Rotte per login e registrazione

// Middleware per proteggere le rotte
app.use(authMiddleware);

// Rotte protette (richiedono autenticazione)
app.use("/api", taskRoutes);            //2
app.use("/api", profileRoutes);         //3
app.use("/api", diaryRoutes);           //4
app.use("/api", activityRoutes);        //5
app.use("/api", workoutPlanRoutes);     //6
app.use("/api", healthRoutes);          //7
app.use("/api", moodRoutes);            //8
app.use('/api', placesRoutes);          //9
app.use('/api', financeRoutes);         //10
app.use('/api', mindfulnessRoutes);     //11
app.use('/api', recipeRoutes);          //12
app.use('/api', noteRoutes);            //13
app.use('/api', preferencesRoutes);     //14
app.use('/api', documentRoutes);        //15


app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}. Sono disponibili i seguenti endpoints:`);
    console.table(endpoints(app));
})