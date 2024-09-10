//Navbar.jsx
import React from "react";
import logo from '../assets/lifehubfinal2.png';
import login from '../assets/Login-button.png';
export default function MyNav() {
    return (
        <header className="bg-white px-5 navnav">
            <nav className="container flex flex-wrap items-center justify-between py-4">
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
                <a href="/login">
                    <img src={login} className="rounded-full" width={100} alt="Life Hub Logo"/>
                </a>
            </nav>
        </header>
    );
}
