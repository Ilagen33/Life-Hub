//DocumentManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentManager = () => {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Carica documento
  const uploadDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      const response = await axios.get('/api/documents/list');
      setDocuments(response.data);
    } catch (error) {
      console.error('Errore durante il recupero dei documenti:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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
