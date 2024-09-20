import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

const TaskProgressChart = ({ tasks }) => {
  const chartRef = useRef(null); // Riferimento al grafico

  // Registra gli elementi necessari
  useEffect(() => {
    Chart.register(ArcElement, Tooltip, Legend);
  }, []);

  // Funzione per creare il grafico
  const createTaskCompletionChart = (ctx, taskStats) => {
    // Se esiste già un grafico, distruggilo prima di crearne uno nuovo
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Crea un nuovo grafico e salva il riferimento a chartRef
    chartRef.current = new Chart(ctx, {
      type: 'doughnut', // Puoi cambiare con 'pie' se preferisci
      data: {
        labels: ['Completed', 'Pending', 'In-progress'],
        datasets: [
          {
            data: [taskStats.completed, taskStats.pending, taskStats.inProgress],
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });
  };

  // Funzione per calcolare le statistiche del completamento dei task
  const calculateTaskStats = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;

    return { completed, pending, inProgress };
  };

  // Crea o aggiorna il grafico ogni volta che i task cambiano
  useEffect(() => {
    if (tasks.length > 0) {
      const ctx = document.getElementById('taskChart').getContext('2d');
      const taskStats = calculateTaskStats();
      createTaskCompletionChart(ctx, taskStats);
    }

    // Pulizia del grafico quando il componente viene smontato
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [tasks]);

  const completedTasks = calculateTaskStats().completed;

  return (
    <section className="mt-8 bg-white p-6 rounded-md shadow-md mx-12 flex justify-around align-center"  width="300" height="300">
        <div>
            <h3 className="text-xl font-bold">Task Completion Progress</h3>
            {/* Canvas con dimensioni ridotte */}
            <canvas id="taskChart" className="mt-4"></canvas>
        </div>

        {/* Sezione del contatore circolare */}
        <div className="flex items-center justify-center flex-col">
        <h3 className="text-xl font-bold">Task Completed</h3>
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            
            <p className="text-4xl font-bold text-green-500">{completedTasks}</p>
            </div>
        </div>
    </section>
  );
};

export default TaskProgressChart;
