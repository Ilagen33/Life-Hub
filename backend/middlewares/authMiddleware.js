import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assicurati di avere il modello User
import dotenv from 'dotenv';

dotenv.config();

// Middleware per autenticare il token JWT
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Estrae il token dalla header Authorization
    console.log(process.env.JWT_SECRET)
    if (!token || typeof token !== 'string') {
        return res.status(401).json({ message: 'Accesso non autorizzato' });
    }
    console.log(token)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica il token
        const user = await User.findById(decoded._id); // Trova l'utente basato sull'ID decodificato
console.log(user)
console.log(decoded)
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        req.user = user; // Aggiungi l'utente alla richiesta per l'accesso successivo
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token scaduto' });
        } else {
            res.status(401).json({ message: 'Token non valido' });

        }
    }

};

export default authMiddleware;
