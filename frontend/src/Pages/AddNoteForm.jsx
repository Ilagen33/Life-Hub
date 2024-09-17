//AddNoteForm.jsx

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AddNoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Other');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagArray = tags.split(',').map((tag) => tag.trim());

    try {
      const newNote = { title, content, tags: tagArray, category };
      await axiosInstance.post('/Notes', newNote);
      alert('Appunto aggiunto con successo!');
      setTitle('');
      setContent('');
      setTags('');
      setCategory('Other');
    } catch (error) {
      console.error('Errore durante l\'aggiunta dell\'appunto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Aggiungi Nuovo Appunto</h2>
      <div>
        <label>Titolo</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Contenuto</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Tag (separati da virgola)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div>
        <label>Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Lecture">Lezione</option>
          <option value="Study">Studio</option>
          <option value="Project">Progetto</option>
          <option value="Other">Altro</option>
        </select>
      </div>

      <button type="submit">Aggiungi Appunto</button>
    </form>
  );
};

export default AddNoteForm;
