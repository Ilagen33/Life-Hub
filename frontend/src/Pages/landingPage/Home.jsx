//Home.jsx
import React from "react";
import MyNav from "../../Components/Navbar.jsx"
import Typewriter from "../../Components/Typewriter.jsx"; // Importa il componente Typewriter

export default function Home() {
    return(
        <div className="Landing-page">
            <MyNav />
            <div className="home-hero">
                {/* Effetto macchina da scrivere su <h1> */}
                <h1>
                    <Typewriter text="LIFE HUB" speed={150} />
                </h1>
                <h2 className="bounceInDown">ALL-IN-ONE PLATFORM</h2>

                <h3 className="first-h3">Una piattaforma intuitiva e sicura per gestire la tua vita personale. 
                    Con LifeHub, semplifichi la tua giornata, tieni traccia di ogni impegno e riflessione, mantieni tutto sotto controllo in un unico posto. 
                </h3>

                <h3 className="second-h3">
                    Facile da usare e potente nei risultati. 
                    Siamo qui per aiutarti a rendere la tua vita più ordinata e produttiva.
                </h3>

                <button className="rounded-full">Unisciti a noi</button>
            </div>
        </div>
    )
};