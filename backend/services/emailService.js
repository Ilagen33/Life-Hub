import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendWelcomeEmail = async (to, subject, htmlContent) => {
  try {
    // Configura il trasporto SMTP per Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Usa 'gmail' se invii tramite Gmail, oppure usa un altro provider
      auth: {
        user: process.env.EMAIL_USER, // La tua email
        pass: process.env.EMAIL_PASS, // La password dell'email o App Password se usi Gmail
      },
    });

    // Definisci il contenuto dell'email
    const mailOptions = {
      from: `"Life Hub" <${process.env.EMAIL_USER}>`, // Mittente
      to, // Destinatario
      subject, // Oggetto dell'email
      html: htmlContent, // Contenuto HTML dinamico
    };

    // Invia l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email inviata: ', info.response);
    return info;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email: ', error);
    throw error;
  }
};

export default sendWelcomeEmail;
