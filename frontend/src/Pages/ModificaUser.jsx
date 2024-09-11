import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UpdateProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [oldPassword, setOldPassword] = useState('');  // Campo per la vecchia password
    const [newPassword, setNewPassword] = useState('');  // Campo per la nuova password

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
