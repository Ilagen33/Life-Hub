//dashNavbar.jsx
import React, {useState} from "react";
import LogoutButton from './LogoutButton.jsx'; // Assicurati di avere un componente Logout
import logo from "../assets/lifehubfinal2.png";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";
export default function DashNav() {
    const [isOpen, setIsOpen] = useState(false);
    return(
        <header>
            <nav className="container bg-gray-800 text-white flex flex-wrap items-center justify-between p-4">
                <a href="/" className="flex items-center">
                    <img
                        alt="Logo-book"
                        src={logo}
                        width="100"
                        className="rounded-full"
                    />
                </a>
                <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
                    aria-label="Toggle navigation"
                >
                    {/* Icona per il menu a tendina su dispositivi mobili */}
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
                <div className="user-menu flex items-center space-x-4">
                    <div className="dropdown relative">
                        <button className="dropdown-button px-3 py-1 rounded hover:bg-gray-600 m-2 rounded-full">Profile</button>
                        <LogoutButton className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 rounded-full" /> 
                    </div>
                </div>
                
            </nav>
            <nav className="flex flex-row items-center justify-center py-4 text-white my-5 mx-5 rounded-full side-nav">
                <ul className="flex items-center justify-center">
                    <li>
                        <NavLink 
                            to="/dashboard" 
                            className="block px-3 py-2 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/tasks" 
                            className="block px-3 py-2 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Attività
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/calendar" 
                            className="block px-3 py-2 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen}
                        >
                            Calendario
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/settings" 
                            className="block px-3 py-2 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Impostazioni
                        </NavLink>
                    </li>
                    <li>
                        <button>
                            {isOpen? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>

    )
};