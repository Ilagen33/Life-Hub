import express from "express";

const router = express.Router();

// Rotta per inviare un'email di promemoria
router.post(
    '/send-reminder', 
    (req, res) => {
        const { email } = req.body;
        sendReminderEmail(email, 'Promemoria Diario', 'Ricordati di aggiornare il tuo diario oggi!');
        res
            .status(200)
            .json({ message: 'Promemoria inviato!' });
    }
);

export default router;
  