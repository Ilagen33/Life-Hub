//NoteList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import { useAuth } from '../../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const NoteList = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('/Notes', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          } 
        });
        setNotes(response.data);
      } catch (error) {
        console.error('Errore durante il recupero degli appunti:', error);
      }
    };
    if(authToken) {
      fetchNotes();
    }
  }, [authToken]);

  const deleteNote = async (noteId) => {
    try {
      await axiosInstance.delete(`/api/Notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
        },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'appunto:', error);
    }
  };

  return (
    <div className='p-6 bg-white shadow-md rounded-md'>
      <h2 className='titoloNote'>I miei Appunti</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p>Categoria: {note.category}</p>
            <p>Tag: {note.tags.join(', ')}</p>
            <button onClick={() => deleteNote(note._id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
