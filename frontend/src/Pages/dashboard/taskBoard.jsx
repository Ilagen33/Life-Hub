// taskBoard.jsx
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axiosInstance from '../../utils/axiosInstance.js'; // Assicurati di usare la tua istanza Axios
import { useAuth } from '../../context/AuthContext.js'; // Per ottenere il token di autenticazione
import { toast } from 'react-toastify'; // Per notifiche visive
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCopy, faBell, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import EditTaskModal from '../tasks/ModalEditTask.jsx';
import TaskProgressChart from '../tasks/TaskProgressChart.jsx';

const ItemType = 'TASK';

const Task = ({ task, index, moveTask, onEdit, onDelete, onDuplicate, onStatusChange, onReminder }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="p-4 mb-2 bg-gray-100 rounded shadow hover:bg-gray-200 transition flex justify-between items-center"
    >
      <div>
        <p className="font-bold">{task.title}</p>
        <p className="text-sm text-gray-500">{task.status}</p>
      </div>
      <div className="flex space-x-2">
        {/* Modifica */}
        <button onClick={() => onEdit(task)} className="text-blue-500">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        {/* Eliminazione */}
        <button onClick={() => onDelete(task._id)} className="text-red-500">
          <FontAwesomeIcon icon={faTrash} />
        </button>
        {/* Duplicazione */}
        <button onClick={() => onDuplicate(task)} className="text-green-500">
          <FontAwesomeIcon icon={faCopy} />
        </button>
        {/* Cambio stato */}
        <button onClick={() => onStatusChange(task)} className="text-gray-500">
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
        {/* Aggiunta promemoria */}
        <button onClick={() => onReminder(task)} className="text-yellow-500">
          <FontAwesomeIcon icon={faBell} />
        </button>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]); // Inizialmente nessun task
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [editModalOpen, setEditModalOpen] = useState(false); // Stato del modal di modifica
  const [taskToEdit, setTaskToEdit] = useState(null); // Task da modificare
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  // Funzione per spostare i task
  const moveTask = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return; // Non fare nulla se il task viene spostato sulla stessa posizione

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);

    // Mostra una notifica di successo
    toast.success('Task spostato con successo!');
  };

  // Funzione per modificare un task
  const handleEdit = async (task) => {
    console.log("Task passato a EditTaskModal:", task); // Debug: controlla se il task viene passato correttamente
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  // Funzione per chiudere il modal di modifica
  const closeEditModal = () => {
    setEditModalOpen(false);
    setTaskToEdit(null);
  };

  // Funzione per salvare le modifiche al task
  const handleSaveTask = async (updatedTask) => {
    try {
      const { user, cover, createdAt, updatedAt, __v, ...taskData } = updatedTask;

      console.log("Payload inviato al server:", updatedTask); // Log per vedere i dati inviati
      const res = await axiosInstance.put(`/task/${updatedTask._id}`, taskData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

    // Verifica che la risposta del server contenga un task valido
    if (!res.data || !res.data.task) {
      throw new Error("Il task aggiornato non è stato ricevuto correttamente dal server");
    }
      // Aggiorna lo stato sostituendo il task modificato con il task aggiornato
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? res.data.task : task))
      );
      console.log("Task aggiornato ricevuto dal server:", res.data.task);

      toast.success('Task modificato con successo!');
    } catch (error) {
      console.error('Errore durante la modifica del task:', error);
      toast.error('Errore durante la modifica del task');
    } finally {
      closeEditModal();
    }
  };

  // Funzione per eliminare un task
  const handleDelete = async (taskId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo task?')) {
      try {
        await axiosInstance.delete(`/task/${taskId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        toast.success('Task eliminato con successo!');
      } catch (error) {
        toast.error('Errore durante l\'eliminazione del task');
      }
    }
  };

  // Funzione per duplicare un task
  const handleDuplicate = async (task) => {
    try {
      const res = await axiosInstance.post('/task', {
        title: `${task.title} (duplicato)`,
        status: task.status,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTasks([...tasks, res.data.task]);
      toast.success('Task duplicato con successo!');
    } catch (error) {
      toast.error('Errore durante la duplicazione del task');
    }
  };

  // Funzione per cambiare lo stato del task (pending, complete)
  const handleStatusChange = async (task) => {
    const newStatus = task.status === 'pending' ? 'complete' : 'pending';
    try {
      const res = await axiosInstance.put(`/task/${task._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? { ...t, status: res.data.task.status } : t))
      );
      toast.success('Stato del task modificato con successo!');
    } catch (error) {
      toast.error('Errore durante la modifica dello stato del task');
    }
  };

  // Funzione per aggiungere un promemoria
  const handleReminder = async (task) => {
    const reminderDate = prompt('Inserisci la data e l\'ora del promemoria (YYYY-MM-DD HH:MM)');
    console.log(reminderDate, task, "Servizio non ancora attivo, arriverà presto");
    toast.success("Servizio non ancora attivo, arriverà presto");
    // if (reminderDate) {
    //   try {
    //     await axiosInstance.post(`/task/${task._id}/reminder`, { reminder: reminderDate }, {
    //       headers: { Authorization: `Bearer ${authToken}` },
    //     });
    //     toast.success('Promemoria aggiunto con successo!');
    //   } catch (error) {
    //     toast.error('Errore durante l\'aggiunta del promemoria');
    //   }
    // }
  };

  // Funzione per recuperare i task dal backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Inizia il caricamento
      try {
        const res = await axiosInstance.get('/task', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // Filtro eventuali task undefined/null prima di aggiornare lo stato
        const validTasks = res.data.tasks.filter((task) => task && task._id);
        setTasks(validTasks); // Aggiorna lo stato solo con i task validi
      } catch (error) {
        console.error('Errore durante il recupero dei task:', error);
        toast.error('Errore durante il recupero dei task');
      } finally {
        setLoading(false); // Fine del caricamento
      }
    };

    if (authToken) {
      fetchTasks();
    }
  }, [authToken]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-white shadow-md rounded-md mx-12">
        {loading ? (
          <p>Caricamento dei task...</p>
        ) : tasks.length === 0 ? (
          <p>Nessun task disponibile</p>
        ) : (
          console.log(tasks),
          tasks.map((task, index) => (
            
            <Task
              key={task._id}
              index={index}
              task={task}
              moveTask={moveTask}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onStatusChange={handleStatusChange}
              onReminder={handleReminder}
            />
          ))
        )}
      </div>
      {/* Modal di modifica */}
      {editModalOpen && taskToEdit && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          task={taskToEdit}
          onSave={handleSaveTask}
        />
      )}
              {/* Aggiungi il componente del grafico */}
              <TaskProgressChart tasks={tasks}/>
    </DndProvider>
  );
};

export default TaskBoard;
