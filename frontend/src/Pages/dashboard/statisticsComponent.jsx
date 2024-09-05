import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Lun', tasks: 5 },
    { name: 'Mar', tasks: 3 },
    { name: 'Mer', tasks: 8 },
    { name: 'Gio', tasks: 6 },
    { name: 'Ven', tasks: 7 },
    { name: 'Sab', tasks: 4 },
    { name: 'Dom', tasks: 2 },
];

const StatisticsComponent = () => {
    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Andamento delle Task</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatisticsComponent;
