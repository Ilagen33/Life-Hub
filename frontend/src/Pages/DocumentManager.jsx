//DocumentManager.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const DocumentManager = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Carica documento
  const uploadDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axiosInstance.post('/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione

         },
      });
      alert('Documento caricato con successo!');
      fetchDocuments();
    } catch (error) {
      console.error('Errore durante il caricamento del documento:', error);
    }
  };

  // Recupera la lista dei documenti caricati
  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get('/list', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
        },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Errore durante il recupero dei documenti:', error);
    }
  };

  useEffect(() => {
    if(authToken) {
    fetchDocuments();
    }
  }, [authToken]);

  return (
    <div>
      <h2>Gestione Documenti</h2>

      <form onSubmit={uploadDocument}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Carica Documento</button>
      </form>

      <h3>Documenti Caricati</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.public_id}>
            <a href={doc.secure_url} target="_blank" rel="noopener noreferrer">
              {doc.original_filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentManager;
