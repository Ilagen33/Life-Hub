import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';

const UpdateProfile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');  // Campo per la vecchia password
    const [newPassword, setNewPassword] = useState('');  // Campo per la nuova password

    // Utilizza useEffect per inizializzare i valori del form solo quando l'utente è disponibile
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const api = axios.create({
            baseURL: 'http://localhost:5000/api',
        });

        try {
            const updateData = { name, email };

            // Aggiungi la password solo se l'utente vuole aggiornarla
            if (newPassword) {
                updateData.oldPassword = oldPassword; // Passa la vecchia password
                updateData.password = newPassword;    // Passa la nuova password
            }

            const response = await api.put(`/me/${user._id}`, updateData);
            setUser(response.data.user); // Aggiorna l'utente nel contesto
            alert('Profilo aggiornato con successo!');
        } catch (err) {
            console.error('Errore durante l\'aggiornamento del profilo:', err);
            alert('Errore durante l\'aggiornamento del profilo');
        }
    };

    if (!user) {
        return <p>Caricamento del profilo in corso...</p>; // Mostra un messaggio finché `user` non è disponibile
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nome:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Vecchia Password (lascia vuoto se non vuoi cambiarla):
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </label>
            <label>
                Nuova Password (lascia vuoto se non vuoi cambiarla):
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </label>
            <button type="submit">Aggiorna Profilo</button>
        </form>
    );
};

export default UpdateProfile;
