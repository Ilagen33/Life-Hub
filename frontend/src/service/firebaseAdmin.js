import admin from 'firebase-admin';
import serviceAccount from '../../../backend/config/life-hub-9e2b8-firebase-adminsdk-uwu2e-7519583458.json'; // Scarica il file JSON da Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://life-hub-9e2b8-default-rtdb.europe-west1.firebasedatabase.app/"
});

const messaging = admin.messaging();

const sendPushNotification = (token, message) => {
  const payload = {
    notification: {
      title: "Nuovo Promemoria",
      body: message,
      icon: "your-icon-url"
    },
    token: token
  };

  messaging.send(payload)
    .then(response => console.log('Notifica inviata con successo:', response))
    .catch(error => console.error('Errore nell\'invio della notifica:', error));
};

export default sendPushNotification;
