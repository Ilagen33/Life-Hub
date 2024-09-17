import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import Modal from 'react-modal'; 
import { useAuth } from '../context/AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUpload } from '@fortawesome/free-solid-svg-icons'; // Importa anche l'icona di upload
import { toast } from 'react-toastify'; // Importa il toast

// Imposta l'elemento principale per il modale
Modal.setAppElement('#root'); 

const ProfilePictureUploader = ({onImageUpload}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState(''); // Aggiungi stato per il nome del file

    const { authToken } = useAuth(); 

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setFileName(file.name); // Salva il nome del file nello stato

        setPreview(URL.createObjectURL(file)); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('media', selectedImage);

        try {
            const response = await axiosInstance.post(
                '/uploadProfilePicture', 
                formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`,
                }
            });

            // Aggiorna l'immagine nel componente genitore
            if (onImageUpload) {
                onImageUpload(preview);  // Esegui la callback per aggiornare la foto
            }
            toast.success('Foto profilo aggiornata con successo!'); // Notifica di successo
            setIsModalOpen(false); 
        } catch (error) {
            console.error('Errore durante il caricamento della foto', error);
        }
        
    };

    return (
        <div>
            {/* Icona che apre il modale */}
            <FontAwesomeIcon 
                icon={faEdit} 
                onClick={toggleModal} 
                className='iconaModifica'
            />

            {/* Modale per il caricamento dell'immagine */}
            <Modal 
                isOpen={isModalOpen} 
                onRequestClose={toggleModal}
                overlayClassName="customOverlay"   //Classe CSS per l'overlay
                className="customModal"            //Classe CSS per il contenuto del modale
            >
                <h3 className="titoloModal">Carica la tua immagine profilo</h3>
                 {/* Aggiungi la nota qui sotto */}
                 <p className="image-note">
                        Nota: L'immagine che caricherai verrà ritagliata in forma circolare. Assicurati di scegliere un'immagine che si adatti bene a questo tipo di ritaglio per evitare che parti importanti vengano tagliate.
                    </p>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    {/* Nascondi il file input e usa un label come pulsante */}
                    <label htmlFor="file-upload" className="uploadButton">
                        <FontAwesomeIcon icon={faUpload} className="mr-2"/> 
                        {/* Icona di upload */}                        
                        Scegli un'immagine
                    </label>
                    <input 
                        id="file-upload" 
                        type="file" 
                        onChange={handleImageChange} 
                        className="hidden"  // Nascondi l'input
                    />  

                    {/* Mostra il nome del file selezionato */}
                    {fileName && <p className="mt-2.5 italic">{fileName}</p>}
                    
                    {preview && (
                        <div style={{ marginBottom: '15px' }}>
                            <h4>Anteprima:</h4>
                            <img src={preview} alt="Anteprima" className="w-28 h-28 rounded-full object-cover"/>
                        </div>
                    )}
                    <button type="submit" className="buttonStyle">Salva immagine</button>
                    <button type="button" onClick={toggleModal} className="closeButtonStyle">Chiudi</button>
                </form>
            </Modal>
        </div>
    );
};


export default ProfilePictureUploader;
