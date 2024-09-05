import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify'
const TasksComponent = () => {
    const [tasks, setTasks] = useState([]);
    
    useEffect(() => {
        fetchTasks();
    },[]);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/api/task');
            setTasks(response.data);
        } catch (error) {
            toast.error('Errore nel recupero delle attività.');
            console.error(error);
        }
    };

    const [newTask, setNewTask] = useState('');

    // Funzione per aggiungere nuove attività
    const addTask = async(e) => {
        e.preventDefault();
        if (newTask.trim() === '') return;
        try {
            const response = await axiosInstance.post('/api/task', { name: newTask, completed: false});
            setTasks([...tasks, response.data]);
            setNewTask('');
            toast.success('Attività aggiunta con successo');
        } catch (error) {
            toast.error('Errore nell\'aggiunta dell\'attività.');
            console.error(error);
        }
    };  
    // Funzione per rimuovere un'attività
    const removeTask = async (taskId) => {
        try {
            await axiosInstance.delete(`/api/task/${taskId}`);
        setTasks(tasks.filter(task => task.id !== taskId));
        toast.success('Attività rimossa con successo');
        } catch (error) {
            toast.error('Errore nella rimozione dell\'attività.');
            console.error(error);
        }
        
    };
    
    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Le tue Tasks</h2>
            <ul className="space-y-3">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={task.completed}
                            onChange={async () => {
                                const newTasks = tasks.map(t =>
                                    t.id === task.id
                                        ? { ...t, completed: !t.completed }
                                        : t
                                );
                                setTasks(newTasks);
                                try {
                                    const task = tasks.find(t => t.id === task.id);
                                    const updatedTask = { ...task, completed: !task.completed };
                                    await axiosInstance.put(`/api/task/${task.id}`, updatedTask);
                                    setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
                                    toast.success(`Attività "${task.name}" aggiornata con successo`)
                                } catch (error) {
                                    toast.error('Errore nell\'aggiornamento dell\'attività.');
                                    console.error(error);
                                }
                                
                                if (!task.completed) {
                                    toast.success(`Hai completato l'attività: ${task.name}`)
                                }
                            }}
                        />
                        <span className={task.completed ? "line-through" : ""}>
                            {task.name}
                        </span>
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
                <button
                    onClick={addTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                    Aggiungi
                </button>
            </div>
        </div>
    );
};

export default TasksComponent;
