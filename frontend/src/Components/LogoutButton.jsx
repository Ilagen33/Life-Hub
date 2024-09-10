//LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
     const navigate = useNavigate();

     const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className='rounded-full px-3 py-1'>
            Logout
        </button>
    );
}

export default LogoutButton;