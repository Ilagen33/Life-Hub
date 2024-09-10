//DiaryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance.js'; // Assicurati che axiosInstance punti al tuo backend

const DiaryPage = () => {
  // Stato per la gestione dei nuovi post e delle voci di diario esistenti
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [currentEntryId, setCurrentEntryId] = useState(null);

  // Funzione per caricare i post di diario esistenti al caricamento della pagina
  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const res = await axios.get('/diary'); // Rotta per ottenere le voci di diario dal backend
        setDiaryEntries(res.data);
      } catch (err) {
        console.error('Errore nel caricamento delle voci di diario:', err);
      }
    };
    fetchDiaryEntries();
  }, []);

  // Funzione per gestire il caricamento del file
  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };
  // Funzione per popolare il form con i dati esistenti per modificare una voce
const handleEdit = (entry) => {
  setTitle(entry.title);
  setContent(entry.content);
  setMedia(null); // Reset del file per evitare conflitti
  setCurrentEntryId(entry._id); // Salva l'ID della voce che stai modificando
};

const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = async (pageNumber) => {
  try {
    const res = await axios.get(`/diary?page=${pageNumber}`);
    setDiaryEntries(res.data);
    setCurrentPage(pageNumber);
  } catch (err) {
    console.error('Errore durante il caricamento della pagina:', err);
  }
};

// Funzione aggiornata per inviare modifiche o nuove voci
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  if (media) {
    formData.append('media', media); // Aggiungi solo se esiste un file
  }

  try {
    const res = currentEntryId
      ? await axios.put(`/diary/${currentEntryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      : await axios.post('/diary', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

    // Aggiorna l'elenco delle voci
    const updatedEntries = currentEntryId
      ? diaryEntries.map((entry) => (entry._id === currentEntryId ? res.data : entry))
      : [res.data, ...diaryEntries];

    setDiaryEntries(updatedEntries);
    setTitle('');   // Resetta il titolo
    setContent(''); // Resetta il contenuto
    setMedia(null); // Resetta il file media
    setCurrentEntryId(null); // Resetta l'ID dopo la modifica o l'inserimento
    alert(currentEntryId ? 'Voce di diario aggiornata!' : 'Voce di diario aggiunta con successo!');
  } catch (err) {
    console.error('Errore durante l\'invio del diario:', err);
    alert('Errore durante l\'invio del diario');
  }
};


  // Funzione per eliminare una voce di diario
const handleDelete = async (id) => {
  try {
    await axios.delete(`/diary/${id}`);
    setDiaryEntries(diaryEntries.filter((entry) => entry._id !== id)); // Rimuovi la voce eliminata
    alert('Voce di diario eliminata con successo');
  } catch (err) {
    console.error('Errore durante l\'eliminazione del diario:', err);
    alert('Errore durante l\'eliminazione del diario');
  }
};
  return (
    <div className="diary-page">
      <h1>Il Mio Diario</h1>
      {/* Form per aggiungere una nuova voce */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titolo:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contenuto:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Media (opzionale):</label>
          <input type="file" onChange={handleFileChange} accept="image/*,video/*,audio/*" />
        </div>
        <button type="submit">
          {currentEntryId ? 'Aggiorna Voce' : 'Aggiungi Voce'}  
        </button>
        <button onClick={() => handleEdit()}>Modifica</button>

      </form>

      {/* Elenco delle voci di diario */}
      <h2>Voci Precedenti</h2>
      <ul>
        {diaryEntries.map((entry) => (
          <li key={entry._id}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
            {/* Se c'è un media allegato, lo mostra */}
            {entry.media && (
              <div>
                {entry.media.endsWith('.jpg') || entry.media.endsWith('.png') ? (
                  <img src={entry.media} alt="Media" />
                ) : entry.media.endsWith('.mp4') ? (
                  <video controls src={entry.media}></video>
                ) : entry.media.endsWith('.mp3') ? (
                  <audio controls src={entry.media}></audio>
                ) : null}
              </div>
            )}
            <button onClick={() => handleDelete(entry._id)}>Elimina</button>
          </li>
        ))}
      </ul>

      {/* Bottoni di navigazione tra le pagine */}  
      <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
        Pagina Precedente
      </button>
      <button onClick={() => handlePageChange(currentPage + 1)}>
        Pagina Successiva
      </button>
    </div>
  );
};

export default DiaryPage;
