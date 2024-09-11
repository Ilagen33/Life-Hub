//userController.js
import jwt from 'jsonwebtoken';
import User from "../models/User.js"; // Assicurati di avere il modello User
import dotenv from 'dotenv';
import sendWelcomeEmail from '../services/emailService.js';
dotenv.config();

// Genera refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d' // 7 giorni di validità per il refresh token
    });
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minuti
export const registerUser = async (req, res, next) => {

    const {nome, cognome, email, dataNascita, username, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(user) {
            return res
                .status(400)
                .json({message: "Utente già registrato"})
        }

        const newUser = new User({nome, cognome, email, dataNascita, username, password});
        await newUser.save();
        const htmlContent = 
        `
            <!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuto a LifeHub</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
        <!-- Header -->
        <tr>
            <td align="center" style="background-color: #4CAF50; padding: 20px;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Benvenuto a LifeHub!</h1>
            </td>
        </tr>
        
        <!-- Body -->
        <tr>
            <td align="center" style="padding: 20px;">
                <p style="font-size: 16px; color: #333333; margin: 0;">Ciao <strong>{{username}}</strong>,</p>
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 20px;">
                    Grazie per esserti unito a <strong>LifeHub</strong>! Siamo entusiasti di averti con noi.
                </p>
                <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Puoi iniziare a esplorare la piattaforma e organizzare la tua vita in modo semplice e intuitivo.
                </p>
                <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Se hai bisogno di assistenza, sentiti libero di rispondere a questa email.
                </p>
            </td>
        </tr>
        
        <!-- Button -->
        <tr>
            <td align="center" style="padding: 20px;">
                <a href="http://localhost:3000" style="background-color: #4CAF50; color: #ffffff; padding: 15px 30px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                    Inizia ad esplorare LifeHub
                </a>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 20px; background-color: #f4f4f4;">
                <p style="font-size: 12px; color: #888888; margin: 0;">&copy; 2024 LifeHub. Tutti i diritti riservati.</p>
                <p style="font-size: 12px; color: #888888; margin: 0;">Questa è un'email automatica, per favore non rispondere.</p>
            </td>
        </tr>
    </table>
</body>
</html>

        `;
        
        await sendWelcomeEmail(newUser.email, "Benvenuto su Life Hub", htmlContent);
        console.log(`Email di benvenuto inviata a ${newUser.email}`);
        
        const accessToken = newUser.generateAuthToken(); // Genera il token di accesso

        res
            .status(201)
            .json({
                accessToken, 
                message:"Utente registrato con successo", 
                success: true
            });
        } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        
        const user = await User.findOne({email});

        if(!user) {
            return res
                .status(400)
                .json({message: "Credenziali non valide"});
        };

        if(user.lockUntil && user.lockUntil > Date.now()) {
            return res
                .status(400)
                .json({
                    message: "Utente bloccato, riprova tra 15 minuti"
                });
        };

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            user.loginAttempts += 1;
            if(user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_TIME;
            }
            await user.save();
            return res
                .status(400)
                .json({message: "Credenziali non valide"})
        }

        // Login riuscito: reset dei tentativi e del blocco
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        const accessToken = user.generateAuthToken(); // Access token
        const refreshToken = generateRefreshToken(user._id); // Refresh token        // res.json({token});

        res
            .status(200)
            .json({
                accessToken,
                refreshToken,
                message: "Login eseguito con successo",
                success: true,
            })
    } catch (err) {
        console.error("Errore durante il login:",err);
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const updates = {...req.body};
        const userId = req.user._id;

        if(updates.password) {
            if(!updates.oldPassword) {
                return res
                    .status(400)
                    .json({message: "La vecchia password è richiesta per cambiare la password"});
            }
        //cerca l'utente nel database
        const user = await User.findById(userId);
        if(!user) {
            return res
                .status(404)
                .json({message: "Utente non trovato"});
        }

        const isMatch = await bcrypt.compare(updates.oldPassword, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({message: "La vecchia password non è corretta"});
        }

            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updates, 
            {new: true, runValidators: true})
            .select("-password");

        if(!updatedUser) {
            return res
                .status(404)
                .json({message: "Utente non trovato"});
        }

        res
            .status(200)
            .json({
                updatedUser,
                message: "Informazioni aggiornate"
            })
    } catch(err) {
        next(err)
    }
};

export const deleteUser = async (req, res, next) => {
    
    try {
        const user = await User.findByIdAndDelete(req.params.id);

    if(!user) {
        return res
            .status(404)
            .json({message: "Utente non trovato"})
    }

    res
        .status(200)
        .json({message: "Account eliminato con successo"})

    } catch (err) {
        next(err);
    }
};

// Endpoint per rigenerare l'access token
export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Token di aggiornamento mancante' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        // Genera un nuovo access token
        const newAccessToken = user.generateAuthToken();
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
};

export const unlockUserAccount = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Invia un'email con un link di sblocco o un codice di verifica

        user.lockUntil = undefined; // Sblocca l'utente
        user.loginAttempts = 0;
        await user.save();

        res.status(200).json({ message: 'Account sbloccato con successo' });
    } catch (err) {
        next(err);
    }
};