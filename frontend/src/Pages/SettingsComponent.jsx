//SettingsComponent.jsx
import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SettingsComponent = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put('/api/users/me', { name, email });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            toast.success('Profilo aggiornato con successo!');
        } catch (error) {
            toast.error('Errore nell\'aggiornamento del profilo.');
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Impostazioni Profilo</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Aggiorna Profilo
                </button>
            </form>
        </div>
    );
};

export default SettingsComponent;
