/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

// Importa Firebase con il supporto compatibile
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Configurazione Firebase (stessa configurazione che usi nel progetto)
const firebaseConfig = {
  apiKey: "AIzaSyC039Bt0cu7eaQkIvU9W8IXhRhw1vodsqo",
  authDomain: "life-hub-9e2b8.firebaseapp.com",
  projectId: "life-hub-9e2b8",
  storageBucket: "life-hub-9e2b8.appspot.com",
  messagingSenderId: "898592536053",
  appId: "1:898592536053:web:9e6a74c94f98618fef1cbc",
  measurementId: "G-GE3YT11QX0"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Ottieni l'istanza di Firebase Messaging
const messaging = firebase.messaging();

// Gestisci notifiche in background
messaging.onBackgroundMessage(function(payload) {
  console.log('Ricevuta notifica in background: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Puoi personalizzare l'icona della notifica
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
