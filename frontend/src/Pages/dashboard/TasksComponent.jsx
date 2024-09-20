import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // Assumi che tu abbia un contesto di autenticazione

const TasksComponent = () => {
    const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto
    const [tasks, setTasks] = useState([]);
    const [priority, setPriority] = useState('media');
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false); // Stato per il caricamento delle task
    const [isAddingTask, setIsAddingTask] = useState(false); // Stato per il caricamento durante l'aggiunta di una task

    useEffect(() => {
        if (authToken) {
            fetchTasks();
        }
    }, [authToken]);

    const fetchTasks = async () => {
        setLoading(true); // Inizio caricamento
        try {
            const response = await axiosInstance.get('/task', {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
                },
            });
            setTasks(response.data.tasks || []); // Assicurati che la risposta contenga un array
        } catch (error) {
            toast.error('Errore nel recupero delle attività.');
            console.error(error);
        } finally {
            setLoading(false); // Fine caricamento
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (newTask.trim() === '') {
            toast.warning('Inserisci una descrizione valida per la task.');
            return;
        }
        setIsAddingTask(true);
        try {
            const response = await axiosInstance.post(
                '/task',
                { name: newTask, completed: false, priority },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
                    },
                }
            );
            setTasks([...tasks, response.data]);
            setNewTask('');
            toast.success('Attività aggiunta con successo');
        } catch (error) {
            toast.error("Errore nell'aggiunta dell'attività.");
            console.error(error);
        } finally {
            setIsAddingTask(false);
        }
    };

    const removeTask = async (taskId) => {
        try {
            await axiosInstance.delete(`/task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
                },
            });
            setTasks(tasks.filter((task) => task.id !== taskId));
            toast.success('Attività rimossa con successo');
        } catch (error) {
            toast.error("Errore nella rimozione dell'attività.");
            console.error(error);
        }
    };

    const toggleTaskCompletion = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            await axiosInstance.put(`/task/${task.id}`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
                },
            });
            setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
            toast.success(`Attività "${task.name}" aggiornata con successo`);
        } catch (error) {
            toast.error("Errore nell'aggiornamento dell'attività.");
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md ms-12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Le tue Tasks</h2>

            {loading ? (
                <p>Caricamento delle attività...</p>
            ) : tasks.length === 0 ? (
                <p>Nessuna attività trovata. Aggiungi una nuova task per iniziare.</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task)}
                            />
                            <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.name}</span>
                            <button
                                onClick={() => removeTask(task.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Rimuovi
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex mt-6">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none w-full"
                    placeholder="Aggiungi una nuova attività"
                    disabled={isAddingTask}
                />
                <div className="ml-2">
                    <label className="block">Priorità:</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
                        disabled={isAddingTask}
                    >
                        <option value="bassa">Bassa</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button
                    onClick={addTask}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-r ml-2 transition-all duration-200 ${
                        isAddingTask ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                    disabled={isAddingTask}
                >
                    {isAddingTask ? 'Aggiungendo...' : 'Aggiungi'}
                </button>
            </div>
        </div>
    );
};

export default TasksComponent;
