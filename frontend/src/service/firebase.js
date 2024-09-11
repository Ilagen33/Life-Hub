// Importa i moduli necessari da Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Per Firebase Authentication
import { getFirestore } from "firebase/firestore";  // Per Firebase Firestore
import { getMessaging } from "firebase/messaging";  // Per Firebase Cloud Messaging

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

// Ottieni i servizi Firebase
const db = getFirestore(app);         // Firebase Firestore
const messaging = getMessaging(app);  // Firebase Messaging

// Esporta i servizi Firebase che utilizzerai
export { db, messaging };
