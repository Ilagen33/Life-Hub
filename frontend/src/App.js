//App.js
import './App.css';
import MyFooter from './Components/Footer.jsx';
import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/landingPage/Home.jsx';
import Food from './Pages/Food.jsx';
import Exercise from './Pages/Exercise.jsx';
import Login from './Pages/landingPage/Login.jsx';
import Register from './Pages/landingPage/Register.jsx';
import Dashboard from './Pages/dashboard/Dashboard.jsx';
import {AuthProvider} from './context/AuthContext.js';
import PrivateRoute from './Components/PrivateRoute.js';
import { messaging } from './service/firebase.js'; // Assicurati che il percorso di importazione sia corretto
import DaCancellare from './Pages/DaCancellare.jsx';
import { ToastContainer, toast } from 'react-toastify'; // Importa react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa lo stile predefinito
import TaskBoard from './Pages/dashboard/taskBoard.jsx';
import ToDo from './Pages/dashboard/To-Do.jsx';

function App() {
  useEffect(() => {
    // Funzione per richiedere il permesso per le notifiche push
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await messaging.getToken();
          console.log("Token di notifica push:", token);
          // Qui puoi inviare il token al backend per salvarlo e usarlo per inviare notifiche push
        } else {
          console.warn("Permesso per le notifiche non concesso");
        }
      } catch (error) {
        console.error("Errore durante la richiesta del permesso:", error);
      }
    };

    requestPermission();
  }, []);
  return (
    <div className="App">
      <Router>

        <AuthProvider>

          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element= {<Login/>} />
            <Route path="/register" element= {<Register/>} />
            
            <Route path="/To-Do" element= {<PrivateRoute><ToDo/></PrivateRoute>} />
            <Route path="/Food" element= {<PrivateRoute><Food /></PrivateRoute>} />
            <Route path="/Exercise" element= {<PrivateRoute><Exercise /></PrivateRoute>} />
            <Route path="/Dashboard/*" element= {<Dashboard />} />
            <Route path="/DaCancellare" element=  {<TaskBoard />} />
          </Routes>
        
        </AuthProvider>
        
        <MyFooter/>
        <ToastContainer position="bottom-right" />  {/* Aggiungi il ToastContainer qui */}

      </Router>
    </div>
  );
}

export default App;
