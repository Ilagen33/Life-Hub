//Footer.jsx
import React from "react";
import logo from "../assets/logofooterfull.png";

export default function MyFooter() {
    return (
        <footer className="z-50 border-t py-3">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                    <a href="/" className="flex items-center text-gray-500 hover:text-gray-700">
                        <img
                            alt="Logo-book"
                            src={logo}
                            width="200"
                            className="mr-2"
                        />
                    </a>
                    <span>© 2024 LifeHub</span>
                </div>
                <ul className="flex space-x-4">
                    <li>
                        <a className="text-gray-500 hover:text-blue-500" href="/">
                            {/* Icona Facebook */}
                        </a>
                    </li>
                    <li>
                        <a className="text-gray-500 hover:text-blue-500" href="/">
                            {/* Icona Instagram */}
                        </a>
                    </li>
                    <li>
                        <a className="text-gray-500 hover:text-blue-500" href="/">
                            {/* Icona Twitter */}
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
