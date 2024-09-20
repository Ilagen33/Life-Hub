import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserCircle, faSun, faMoon, faChevronDown, faSearch, faTasks , faHistory, faCalendar, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import NewTaskModal from './ModalNewTask';
const Navbar = ({ onSearch, onAddTask, toggleDarkMode, isDarkMode }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const createTask = () => {
    console.log("Ciao");
    
  }

    return (
        <nav className= " bg-gray-800 p-4 shadow-lg ps-12 mb-5">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo o titolo */}
                <div className="text-white text-2xl font-bold">
                    <FontAwesomeIcon icon={faTasks} className="mr-2" />
                    Task Manager
                </div>

                {/* Barra di ricerca */}
                <div className="flex items-center w-1/2">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Cerca task..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            onSearch(e.target.value); // Callback di ricerca
                        }}
                    />
                    <button className="bg-gray-100 px-4 py-2 rounded-r-md hover:bg-gray-200">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>

                {/* Pulsante Aggiungi Task */}
                <button
                    onClick={() => setIsModalOpen(true)} // Apre il modal
                    className="newBtn text-white px-4 py-2 ml-4 rounded-md hover:bg-orange-600 hover:text-white transition duration-300 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" onClick={openModal}/>
                    New
                </button>
                <NewTaskModal isOpen={isModalOpen} onClose={closeModal} createTask={createTask} />

                {/* Filtri dropdown */}
                <div className="relative ml-4 group">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center">
                        Filtri
                        <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                <FontAwesomeIcon icon={faTasks} className="mr-2" />
                                Priorità Bassa
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                <FontAwesomeIcon icon={faTasks} className="mr-2" />
                                Priorità Media
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                <FontAwesomeIcon icon={faTasks} className="mr-2" />
                                Priorità Alta
                            </li>
                            <hr className="my-2" />
                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                <FontAwesomeIcon icon={faTasks} className="mr-2" />
                                Task Completate
                            </li>
                        </ul>
                    </div>
                </div>
                
                <button 
                className=" text-white px-4 py-2 rounded-md ml-4 hover:bg-blue-600 flex items-center"
                onClick={console.log("Si deve creare la funzione: syncWithGoogleCalendar per sincronizzare il calendario di Google")}
                >
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        Sincronizza
                </button>
                {/* Icona utente con dropdown */}
                <div className="relative ml-4 group">
                    <button className="text-white hover:text-gray-200">
                        <FontAwesomeIcon icon={faUserCircle} className="fa-xl" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-100">Profilo</li>
                            <li className="px-4 py-2 hover:bg-gray-100">Impostazioni</li>
                            <li className="px-4 py-2 hover:bg-gray-100">Logout</li>
                        </ul>
                    </div>
                </div>
               
                <div className="relative ml-4 group">
                    <button className="text-white hover:text-gray-200">
                        <FontAwesomeIcon icon={faHistory} className="fa-xl" />
                    </button>
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100">Task eliminata 5 min fa</li>
                            <li className="px-4 py-2 hover:bg-gray-100">Task completata ieri</li>
                            <li className="px-4 py-2 hover:bg-gray-100">Modifica task 2 giorni fa</li>
                        </ul>
                    </div>
                </div>

                {/* Toggle Dark/Light Mode */}
                <button onClick={toggleDarkMode} className="ml-4 text-white hover:text-gray-200">
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="fa-xl" />
                </button>
            </div>

            {/* Modal per creare nuova task */}
            <ReactModal open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <ReactModal.Panel className="mx-auto max-w-md bg-white rounded p-6 shadow-lg">
                        <ReactModal.Title className="text-lg font-bold">Aggiungi una Nuova Task</ReactModal.Title>
                        <form className="mt-4">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                                placeholder="Nome della task"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Aggiungi
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="ml-4 text-gray-600 hover:text-gray-800"
                            >
                                Annulla
                            </button>
                        </form>
                    </ReactModal.Panel>
                </div>
            </ReactModal>
        </nav>
    );
};

export default Navbar;
