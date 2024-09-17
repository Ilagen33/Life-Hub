import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; //Importa il contesto di autenticazione

function LogoutButton() {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Ottieni la funzione di logout dal contesto

    const handleLogout = () => {
        logout(); // Chiama la funzione di logout dal contesto per pulire tutto correttamente
        navigate('/login'); // Reindirizza l'utente alla pagina di login
    };

    return (
        <button onClick={handleLogout} className='rounded-full px-3 py-1'>
            Logout
        </button>
    );
}

export default LogoutButton;
