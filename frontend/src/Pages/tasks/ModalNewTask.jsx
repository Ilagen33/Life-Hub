import React, { useState , useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFlag, faTag, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const NewTaskModal = ({ isOpen, onClose, createTask }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [openMenu, setOpenMenu] = useState(''); // Stato per gestire i menu aperti

  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crea un oggetto task
    const newTask = {
      title,
      content,
      priority,
      tags, // Trasforma i tag in un array
      dueDate
    };

    // Invia il task al backend
    createTask(newTask);

    // Chiude il modal e resetta i campi
    onClose();
    setTitle('');
    setContent('');
    setPriority('medium');
    setTags([]);
    setDueDate('');
  };


  // Ref per i menu
  const dateRef = useRef(null);
  const priorityRef = useRef(null);
  const tagsRef = useRef(null);

  // Funzione per chiudere il menu se clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu === 'date' && dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenMenu('');
      }
      if (openMenu === 'priority' && priorityRef.current && !priorityRef.current.contains(event.target)) {
        setOpenMenu('');
      }
      if (openMenu === 'tags' && tagsRef.current && !tagsRef.current.contains(event.target)) {
        setOpenMenu('');
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const handleInputChange = (e) => {
    setContent(e.target.value);
    
    // Modifica l'altezza dinamicamente
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Resetta l'altezza per calcolare la nuova altezza correttamente
    textarea.style.height = textarea.scrollHeight + 'px'; // Imposta l'altezza dinamica
  };


  const handleAddTag = (e) => {
    if (e.key === ' ' && e.target.value.trim() !== '') {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  const renderPriority = () => {
    if (!priority) return 'Priorità';
    return `Priorità: ${priority}`;
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

  if (!isOpen) return null; // Se il modal non è aperto, non renderizza nulla

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
        
      {/* Chiudi finestra */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

      
        </div>

        {/* Titolo */}
          <div className="mb-4">
            <input
              type="text"
              id="taskTitle"
              className="w-full rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome dell'attività"
              required
            />
          </div>

        {/* Descrizione */}
          <div className="mb-4">
            <textarea
              id="taskContent"
              className="w-full rounded-md"
              rows="1"
              value={content}
              onChange={handleInputChange}
              placeholder='Descrizione'
              ref={textareaRef} // Collegamento al ref per accedere al DOM
              style={{ overflow: 'hidden' }} // Nasconde lo scroll verticale

            />
          </div>

          <div className="flex space-x-4 mb-4">
          {/* Data di Scadenza */}
            <div className="relative"  ref={dateRef}>
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
            <div className="relative" ref={priorityRef}>
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
            <div className="relative" ref={tagsRef}>
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
              className=" bg-gray-800 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <FontAwesomeIcon icon={faCheck} />

            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
