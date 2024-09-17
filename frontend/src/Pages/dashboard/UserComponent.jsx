import React, {useState, useEffect} from 'react';
import { useAuth } from '../../context/AuthContext.js'; 
import axiosInstance from '../../utils/axiosInstance.js';
import { jwtDecode } from 'jwt-decode';
import ProfilePictureUploader from '../../Components/ProfilePictureUploader.jsx';

const UserInfoComponent = () => {
    const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto
    const [userInfo, setUserInfo] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {

        if (authToken) {
            console.log('Auth token:', authToken); // Verifica se il token è presente

          // Decodifica il token per ottenere l'ID utente
          const decodedToken = jwtDecode(authToken);
          console.log(decodedToken);
          setUserId(decodedToken._id); // Supponendo che 'userId' sia nel token
        }
    }, [authToken]);

    console.log(`${userId}`)


    useEffect(() => {
        const fetchInfo = async () => {
            try {                
                const res = await axiosInstance.get(`/me/${userId}`);
                setUserInfo(res.data.user);
                console.log(userId);
            } catch (error) {
                console.error('Errore durante il recupero delle informazioni utente:', error);
            }
        };
    // Esegui la richiesta solo se userId è disponibile
    if (userId) {
        fetchInfo();
      }
    }, [authToken, userId]);

    // Funzione che aggiorna l'avatar dopo il caricamento
    const handleImageUpload = (newAvatarUrl) => {
      setUserInfo((prevInfo) => ({ ...prevInfo, avatar: newAvatarUrl }));
  };

    if (!userInfo) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <p className="text-lg text-gray-700">Caricamento informazioni utente...</p>
            </div>
          
          
        );
    }
    console.log(userInfo);

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 usertext">Ciao, {userInfo.username}</h2>
      <div className="space-y-4">
        <div>
          <img src={userInfo.avatar} className='rounded-full w-36'/>
          <ProfilePictureUploader onImageUpload={handleImageUpload}/>
        </div>
        <div>
          <h3 className="text-md font-semibold">Nome:</h3>
          <p>{userInfo.nome} {userInfo.cognome}</p>
        </div>
        <div>
          <h3 className="text-md font-semibold">Email:</h3>
          <p>{userInfo.email}</p>
        </div>
        {/* Aggiungi ulteriori informazioni utente se necessario */}
      </div>
    </div>
  );
};

export default UserInfoComponent;
