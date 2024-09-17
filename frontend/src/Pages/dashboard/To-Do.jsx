//To-Do.jsx
import React, { useState } from 'react';
// import cron from 'node-cron';
// import { sendPushNotification } from '../utils/pushNotification';
// import Task from '../models/Task';
// import User from '../models/User';

export default function ToDo() {
    const [todos, setTodos] = useState([
        { text: 'Completare il progetto', done: false },
        { text: 'Fare esercizio fisico', done: false },
        { text: 'Comprare il cibo', done: false }
    ]);

    const toggleTodo = (index) => {
        const newTodos = [...todos];
        newTodos[index].done = !newTodos[index].done;
        setTodos(newTodos);
    };

    return (
        <div className="todo-list p-6 bg-white shadow-md rounded-md">
            <h3>Lista delle cose da fare</h3>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                        <input 
                            type="checkbox" 
                            checked={todo.done} 
                            onChange={() => toggleTodo(index)} 
                            className='me-1.5'
                        />
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};