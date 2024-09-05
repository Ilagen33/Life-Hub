import mailgun from 'mailgun-js';
import "dotenv/config";

const mg = mailgun({ 
    apiKey: process.env.MAILGUN_API_KEY, 
    domain: process.env.MAILGUN_DOMAIN 
});

const sendReminderEmail = async (to, subject, text) => {
  const data = {
    from: process.env.EMAIL_FROM, // Email mittente
    to,                           // Email destinatario
    subject,                      // Oggetto dell'email
    html: htmlContent, // Contenuto HTML dell'email
  };

  try {
  // Invio dell'email
  const response = await mg.messages().send(data);
  console.log('Email inviata con successo:', response);
  return response;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);    
    throw error;
  };
}

export default sendReminderEmail;
