import firebase from "firebase/app";
import "firebase/auth"; // Se usi Firebase Authentication
import "firebase/firestore"; // Se usi Firebase Firestore (database)

// Importa i moduli individuali di Firebase
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC039Bt0cu7eaQkIvU9W8IXhRhw1vodsqo",
  authDomain: "life-hub-9e2b8.firebaseapp.com",
  projectId: "life-hub-9e2b8",
  storageBucket: "life-hub-9e2b8.appspot.com",
  messagingSenderId: "898592536053",
  appId: "1:898592536053:web:9e6a74c94f98618fef1cbc",
  measurementId: "G-GE3YT11QX0"
};

// Inizializza l'app Firebase
const app = initializeApp(firebaseConfig);

// Ottieni l'istanza di Analytics
// const analytics = getAnalytics(app);

// Ottieni l'istanza di Firebase Messaging
const messaging = getMessaging(app);

// Esporta i servizi Firebase che utilizzerai (esempio: auth, firestore)
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };

export { messaging };
