//dashNavbar.jsx
import React, {useState} from "react";
import logo from "../assets/lifehubfinal2.png";
export default function DashNav() {
    return(
        <header>
            <nav className="container side-nav  text-white flex flex-wrap items-center justify-center p-4">
                <a href="/" className="flex items-center">
                    <img
                        alt="Logo-book"
                        src={logo}
                        width="100"
                        className="rounded-full"
                    />
                </a>
            </nav>
        </header>

    )
};