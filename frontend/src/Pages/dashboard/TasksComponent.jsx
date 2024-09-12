import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // Assumi che tu abbia un contesto di autenticazione

const TasksComponent = () => {
    const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto
    const [tasks, setTasks] = useState([]);
    const [priority, setPriority] = useState('media');
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        console.log('Auth Token:', authToken);  // Log temporaneo per vedere il token
        if(authToken) {
        fetchTasks();
        }
    }, [authToken]);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/task', {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
                },
            });
            setTasks(response.data);
        } catch (error) {
            toast.error('Errore nel recupero delle attività.');
            console.error(error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (newTask.trim() === '') return;
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

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Le tue Tasks</h2>
            <ul className="space-y-3">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={task.completed}
                            onChange={async () => {
                                const newTasks = tasks.map((t) =>
                                    t.id === task.id
                                        ? { ...t, completed: !t.completed }
                                        : t
                                );
                                setTasks(newTasks);
                                try {
                                    const taskToUpdate = tasks.find((t) => t.id === task.id);
                                    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
                                    await axiosInstance.put(`/task/${task.id}`, updatedTask, {
                                        headers: {
                                            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
                                        },
                                    });
                                    setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
                                    toast.success(`Attività "${taskToUpdate.name}" aggiornata con successo`);
                                } catch (error) {
                                    toast.error("Errore nell'aggiornamento dell'attività.");
                                    console.error(error);
                                }
                            }}
                        />
                        <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
                        <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Rimuovi
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none w-full"
                    placeholder="Aggiungi una nuova attività"
                />
                <div>
                    <label>Priorità:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="bassa">Bassa</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded-r">
                    Aggiungi
                </button>
            </div>
        </div>
    );
};

export default TasksComponent;
