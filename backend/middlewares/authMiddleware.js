//authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assicurati di avere il modello User
import dotenv from 'dotenv';

dotenv.config();

// Middleware per autenticare il token JWT
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Estrae il token dalla header Authorization
    if (!token) {
        return res.status(401).json({ message: "Non c'è il token" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica il token
        console.log('Token decodificato:', decoded);

        const user = await User.findById(decoded._id); // Trova l'utente basato sull'ID decodificato
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        req.user = user; // Aggiungi l'utente alla richiesta per l'accesso successivo
        next();
    } catch (err) {

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token scaduto' });
        } else {
            res.status(401).json({ message: `Token non valido${err}`} );

        }
    }

};

export default authMiddleware;
