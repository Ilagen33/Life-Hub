import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTasks, faUtensils, faRunning, faBook, faChartLine, faCog, faArrowRight, faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // Importa il contesto di autenticazione
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    
  const [isOpen, setIsOpen] = useState(false); // Stato per la sidebar aperta/chiusa
  const { logout } = useAuth(); // Usa la funzione di logout dal contesto di autenticazione
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle dell'apertura/chiusura
  };

  const handleLogout = () => {
    logout(); // Esegui il logout
    navigate('/login'); // Naviga verso la pagina di login
  };

  // Aggiungiamo l'uso di useEffect per chiudere la sidebar allo scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && isOpen) {
        setIsOpen(false);  // Chiudi la sidebar se lo scroll supera i 100px
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Pulizia dell'evento quando il componente viene smontato
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-50 ${isOpen ? 'w-64' : 'w-16'} duration-700 ease-in-out`}>
      <div className="py-4 flex flex-col items-center justify-between h-full relative">
        <h2 className={`text-xl font-semibold mb-4 transition-opacity ease-in-out
          ${isOpen ? 'duration-500 delay-300 opacity-100' : 'duration-200 opacity-0'}`}>
          Menu
        </h2>        {/* Icona per aprire/chiudere la sidebar */}
        <button 
          onClick={toggleSidebar} 
          className="text-white absolute top-1/2 transform -translate-y-1/2 left-full focus:outline-none p-2 bg-gray-800 rounded-r-full"
        >
          {/* Cambiamo l'icona in base allo stato della sidebar */}
          <FontAwesomeIcon 
            icon={faArrowRight} size="lg" 
            className={`transform transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}    
        />
        </button>

        <div className={`mt-10 space-y-4 w-full transition-full duration-500 ${isOpen ? 'translate-y-0' : '-translate-y-40'}`}>
        <NavLink
          to="/Dashboard"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          {/* Il testo scompare con `pointer-events: none` quando la sidebar è chiusa */}
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Dashboard
          </span>
        </NavLink>

        <NavLink
          to="/Dashboard/tasks"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faTasks} className="mr-2" />
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Task
          </span>
        </NavLink>

        <NavLink
        
          to="/Dashboard/calendar"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faUtensils} className="mr-2" />
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Meal Planner
          </span>
        </NavLink>

        <NavLink
          to="/Dashboard/notes"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faRunning} className="mr-2" />
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Fitness
          </span>
        </NavLink>

        <NavLink
          to="/Dashboard/diary"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faBook} className="mr-2" />
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Diario
          </span>
        </NavLink>

        <NavLink
          to="/Dashboard/statistics"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Statistiche
          </span>
        </NavLink>

        <NavLink
          to="/Dashboard/settings"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-all duration-500"
        >
          <FontAwesomeIcon icon={faCog} className="mr-2" />
          <span
            className={`sidebar-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Impostazioni
          </span>
        </NavLink>
        </div>

        <div className="w-full">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            {isOpen && <span className={`transition-opacity duration-500 delay-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
