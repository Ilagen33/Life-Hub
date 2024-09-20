import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faTag, faFlag, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const EditTaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState([]);
  const [openMenu, setOpenMenu] = useState(''); // Stato per gestire i menu aperti

  useEffect(() => {
    if (task) {
      console.log("Task ricevuto in EditTaskModal:", task); // Debug: verifica se il task ha l'ID
      setTitle(task.title);
      setContent(task.content);
      setStatus(task.status);
      setDueDate(task.dueDate);
      setPriority(task.priority || 'medium'); // Assicurati di avere la priorità nel task
      setTags(task.tags || []);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...task, // Usa l'oggetto task originale, che include l'ID
      title,
      content,
      status,
      dueDate,
      priority,
      tags,
    });
  };

  const renderPriority = () => {
    if (!priority) return 'Priorità';
    return `Priorità: ${priority}`;
  };

  const handleAddTag = (e) => {
    if (e.key === ' ' && e.target.value.trim() !== '') {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  const renderTags = () => {
    if (tags.length === 0) return 'Tags';
    return tags.join(', ');
  };

  const handleDateClick = (dateOption) => {
    const today = new Date();
    if (dateOption === 'Oggi') {
      setDueDate(today.toISOString().split('T')[0]);
    } else if (dateOption === 'Domani') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  };

  const renderStatus = () => {
    if (!status) return 'Stato';
    return `Stato: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl">

        {/* Chiudi finestra */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>

        {/* Titolo */}
          <div className="mb-4">
            <input
              type="text"
              className="w-full rounded-md p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Modifica Titolo'
              id='EditTaskTitle'
            />
          </div>

        {/*Descrizione  */}
          <div className="mb-4">
            <textarea
              id='EditTaskContent'
              className="w-full rounded-md p-2"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Modifica Descrizione'
            />
          </div>

        <div className='flex space-x-4'>

          {/* Stato */}
           <div className="mb-4">
            <button
              type="button"
              className={`flex items-center space-x-2 border px-4 py-2 rounded-full opacity-70 hover:opacity-100 ${
                status ? 'text-orange-600' : ''
              }`}
              onClick={() => setOpenMenu(openMenu === 'status' ? '' : 'status')}
            >
              <span>{renderStatus()}</span>
            </button>
            {openMenu === 'status' && (
              <div className="absolute bg-white shadow-md rounded mt-2 p-2 w-48 z-10">
                <ul>
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                    onClick={() => setStatus('pending')}
                  >
                    In-progress
                  </li>
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                    onClick={() => setStatus('completed')}
                  >
                    Completed
                  </li>
                </ul>
              </div>
            )}
          </div>

        {/* Data di scadenza */}
          <div className="mb-4">
            <button
                type="button"
                className={`flex items-center space-x-2 border px-4 py-2 rounded-full opacity-70 hover:opacity-100 ${dueDate ? 'text-orange-600' : ''}`}
                onClick={() => setOpenMenu(openMenu === 'date' ? '' : 'date')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{dueDate ? `Scadenza: ${dueDate}` : 'Data di scadenza'}</span>
              </button>
              {openMenu === 'date' && (
                <div className="absolute bg-white shadow-md rounded mt-2 p-2 w-64 z-10">
                  <ul>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" onClick={() => handleDateClick('Oggi')}>
                      Oggi
                    </li>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" onClick={() => handleDateClick('Domani')}>
                      Domani
                    </li>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                      <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </li>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200 text-red-500" onClick={() => setDueDate('')}>
                      Annulla
                    </li>
                  </ul>
                </div>
              )}
          </div>

        {/* Priorità */}
          <div className='mb-4'>
          <button
                type="button"
                className={`flex items-center space-x-2 border px-4 py-2 rounded-full opacity-70 hover:opacity-100 ${priority ? 'text-orange-600' : ''}`}
                onClick={() => setOpenMenu(openMenu === 'priority' ? '' : 'priority')}
              >
                <FontAwesomeIcon icon={faFlag} />
                <span>{renderPriority()}</span>
              </button>
              {openMenu === 'priority' && (
                <div className="absolute bg-white shadow-md rounded mt-2 p-2 w-48 z-10">
                  <ul>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" onClick={() => setPriority('Bassa')}>
                      Bassa
                    </li>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" onClick={() => setPriority('Media')}>
                      Media
                    </li>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" onClick={() => setPriority('Alta')}>
                      Alta
                    </li>
                  </ul>
                </div>
              )}
          </div>

        {/* Tags */}
          <div className='mb-4'>
          <button
                type="button"
                className={`flex items-center space-x-2 border px-4 py-2 rounded-full opacity-70 hover:opacity-100 ${tags.length > 0 ? 'text-orange-600' : ''}`}
                onClick={() => setOpenMenu(openMenu === 'tags' ? '' : 'tags')}
              >
                <FontAwesomeIcon icon={faTag} />
                <span className="truncate w-32">{renderTags()}</span>
              </button>
              {openMenu === 'tags' && (
                <div className="absolute bg-white shadow-md rounded mt-2 p-2 w-64 z-10">
                  <input
                    type="text"
                    className="border px-4 py-2 rounded w-full"
                    placeholder="Aggiungi tag e premi spazio"
                    onKeyPress={handleAddTag}
                  />
                  <ul>
                    {tags.length > 0 && (
                      <li className="cursor-pointer px-4 py-2 hover:bg-gray-200 text-red-500" onClick={() => setTags([])}>
                        Annulla
                      </li>
                    )}
                  </ul>
                </div>
              )}
          </div>
          </div>

          {/* Pulsanti di controllo */}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-800 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} /> 
            </button>
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <FontAwesomeIcon icon={faCheck} /> 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
