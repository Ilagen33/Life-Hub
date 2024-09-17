//CalendarComponent.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
    // Simulazione task per ogni giorno (vuoto per ora)
    const [tasks, setTasks] = useState({
        // Ogni giorno ha uno stato: "inProgress", "completed", "empty", "notCompleted"
        '2024-09-10': { status: 'completed', task: 'Task completato' },
        '2024-09-12': { status: 'inProgress', task: 'Task in corso' },
        '2024-09-14': { status: 'notCompleted', task: 'Task non completato' },
        // altri giorni...
    });

    // Funzione per ottenere il task di un giorno (ritorna "vuoto" se non esiste)
    const getTaskForDate = (date) => {
        const taskDate = date.toISOString().split('T')[0];
        return tasks[taskDate] || { status: 'empty', task: '' };
    };

    // Funzione per determinare il colore del pallino in base allo stato del task
    const getDotColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'inProgress':
                return 'bg-yellow-500';
            case 'notCompleted':
                return 'bg-red-500';
            case 'empty':
            default:
                return 'bg-gray-300';
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <Calendar
                className="border-none"
                tileClassName="p-4 h-24 w-96 text-center"  // Aumenta l'altezza e padding delle celle

                tileContent={({ date, view }) => {
                    if (view === 'month') {
                        const taskInfo = getTaskForDate(date);
                        return (
                            <div className="flex justify-center items-center">
                                <span className={`w-3 h-3 rounded-full ${getDotColor(taskInfo.status)}`}></span>
                                <span className="text-xs text-gray-600">{taskInfo.task}</span>
                            </div>
                        );
                    }
                }}
            />
        </div>
    );
};

export default CalendarComponent;
