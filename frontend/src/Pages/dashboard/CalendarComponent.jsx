//CalendarComponent.jsx

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Calendario</h2>
            <Calendar className="border-none" />
        </div>
    );
};

export default CalendarComponent;
