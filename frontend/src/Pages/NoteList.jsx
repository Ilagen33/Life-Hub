//NoteList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Errore durante il recupero degli appunti:', error);
      }
    };

    fetchNotes();
  }, []);

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`/api/notes/delete/${noteId}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'appunto:', error);
    }
  };

  return (
    <div>
      <h2>I miei Appunti</h2>
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
