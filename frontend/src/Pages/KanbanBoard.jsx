import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axiosInstance  from '../utils/axiosInstance.js'; // Se usi axios per gestire le chiamate API
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const KanbanBoard = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [tasks, setTasks] = useState([]); // Stato per memorizzare le attività

  // Funzione per recuperare le attività dal server
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/task', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
        },
      }); // Rotta per ottenere le attività
      setTasks(response.data); // Salva i dati nello stato
    } catch (error) {
      console.error('Errore durante il recupero delle attività:', error);
    }
  };

  useEffect(() => {
    if(authToken) {
    fetchTasks();
    } // Recupera le attività al caricamento della pagina
  }, [authToken]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Riordina le attività nel caso di spostamento nella stessa lista
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="kanbanBoard">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '200px' }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: 'none',
                      padding: '16px',
                      margin: '0 0 8px 0',
                      backgroundColor: '#fff',
                      ...provided.draggableProps.style,
                    }}
                  >
                    {task.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
