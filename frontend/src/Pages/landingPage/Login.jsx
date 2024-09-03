import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importa il modulo axios per effettuare le richieste HTTP
import logo from '../../assets/lifehubfinal2.png';
import { FaGoogle } from "react-icons/fa";
export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    // Configura un'istanza di axios con l'URL di base
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    const loginUser = async (credentials) => {
        console.log(credentials)
        try {

          const response = await api.post("/login", credentials); // Effettua la richiesta di login
          console.log("Risposta API login:", response.data); // Log della risposta per debugging
          console.log(response.data.token)
          console.log(response)
          localStorage.setItem('token', response.data.token);
          return response.data; // Restituisce i dati della risposta
          
        } catch (error) {
          console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
          setError("Email o password errati"); // Imposta l'errore nello stat
          throw error; // Lancia l'errore per essere gestito dal chiamante
        }
      };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser(formData);
            localStorage.setItem("token", response.token);
            console.log("Login effettuati con successo!");
            navigate("/Dashboard");
        } catch (error) {
            console.error("Errore durante il login:", error);
            alert("Credenziali non valide. Riprova.")
            setError("Credenziali non valide. Riprova.");
        }
    };

    const handleGoogleLogin = async () => {
        window.location.href = 'http://localhost:5000/api/google/callback';
    }
    return(
        <>
            <a href="/">
                    <img
                        alt="Logo-book"
                        src={logo}
                        width="100"
                        className="rounded-full m-5"
                    />
                </a>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    {/* <!-- Messaggio di benvenuto --> */}
                    <h1 className="text-9xl font-bold text-center text-gray-800 mb-6 h1-login">
                        Login
                    </h1>
    
                    {/* <!-- Form di autenticazione --> */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" for="email">
                                Email
                            </label>
                            <input  
                                type="email"
                                name="email"
                                placeholder="Inserisci la tua email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" for="password">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Inserisci la tua password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                            {/* Visualizzazione dell'errore */}
                            {error && <p className="text-red-600 text-center mt-2">{error}</p>}

                            {/* <!-- Pulsante di Login --> */}
                                <button
                                    type="submit"
                                    className="text-white w-full py-3 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition font-bold mt-4 bottone-login1"
                                >
                                    Accedi
                                </button>

                            {/* <!-- Pulsante di Login con Google --> */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="flex items-center justify-center text-white w-full py-3 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition font-bold mt-4 bottone-login2"
                                >
                                    Accedi con Google
                                    <FaGoogle className="ml-2"/>
                                </button>
                    </form>

                        {/* <!-- Link alla pagina di registrazione --> */}
                        <p className="text-center text-gray-600 mt-6">
                            Non sei ancora registrato?    
                            <a href="/register" className="underline text-orange-600 hover:text-red-700"> Clicca qui!</a>
                        </p>
                </div>
            </div>
        </>
    )
};