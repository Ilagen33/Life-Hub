//Register.jsx
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import logo from '../../assets/lifehubfinal2.png'; // Assicurati che il percorso dell'immagine sia corretto
import { useNavigate } from 'react-router-dom';
import axios from "axios"; // Importa il modulo axios per effettuare le richieste HTTP

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})


const registerUser = async (userData) => {
    try{
        
        const response = await api.post("/register", userData);

        console.log("Registrazione avvenuta con successo:", response.data);
        return response.data;

    }   catch (error) {

        if(error.response) {
            console.error("Errore nella registrazione:", error.response);
            throw new Error(error.response.data || "Errore durante la registrazione. Riprova.");
        
        } else if(error.request) {
            console.error("Errore durante nella richiesta :", error.request);
            throw new Error("Errore durante la registrazione. Riprova.");
        
        } else {
            console.error("Errore durante la configurazione della richiesta:", error.message);
            throw new Error("Errore sconosciuto durante la registrazione. Riprova.");
        }
    }   
}

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    username: '',
    dataNascita: '',
    password: '',
    confirmPassword: '',
    
  });

const navigate = useNavigate();
const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    try {
        const data = await registerUser(formData);
        console.log('Dati ricevuti dopo la registrazione:', data);

        localStorage.setItem('token', data.accessToken); // Salva il token se presente
        alert('Registrazione avvenuta con successo');
        navigate("/login")
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        setError('Errore durante la registrazione. Riprova');
        alert('Errore durante la registrazione. Riprova');
    }
    setError('');
    console.log('Registrazione avvenuta con successo');
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/google/callback';
  };

  return (
    <>
      <a href="/">
        <img
          alt="Logo"
          src={logo}
          width="100"
          className="rounded-full m-5"
        />
      </a>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg my-2">
          <h1 className="text-9xl font-bold text-center text-gray-800 mb-6 h1-login">
            Registrati
          </h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="nome" className="block text-gray-700 font-bold mb-2">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Inserisci il tuo nome"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="cognome" className="block text-gray-700 font-bold mb-2">Cognome</label>
              <input
                type="text"
                id="cognome"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                placeholder="Inserisci il tuo cognome"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Scegli un username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="dataNascita" className="block text-gray-700 font-bold mb-2">Data di Nascita</label>
              <input
                type="date"
                id="dataNascita"
                name="dataNascita"
                value={formData.dataNascita}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Inserisci la tua password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Conferma Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Conferma la tua password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition"
            >
              Registrati
            </button>

            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition"
              >
                <FaGoogle className="mr-2" /> Google
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Già registrato? <a href="/login" className="underline text-orange-600 hover:text-red-700">Accedi qui</a>
          </p>
        </div>
      </div>
    </>
  );
}
