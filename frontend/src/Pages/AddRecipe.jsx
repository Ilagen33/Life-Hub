import React, { useState } from 'react';
import axios from 'axios';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);
  const [category, setCategory] = useState('Breakfast');
  const [notes, setNotes] = useState('');

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      const data = { name, ingredients, steps, category, notes };
      await axios.post('/api/recipes/add', data);
      alert('Ricetta aggiunta con successo!');
      setName('');
      setIngredients([{ name: '', quantity: '' }]);
      setSteps(['']);
      setCategory('Breakfast');
      setNotes('');
    } catch (error) {
      console.error('Errore durante l\'aggiunta della ricetta:', error);
    }
  };

  return (
    <form onSubmit={handleAddRecipe}>
      <h2>Aggiungi una Nuova Ricetta</h2>
      <div>
        <label>Nome della ricetta</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Ingredienti</label>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nome dell'ingrediente"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Quantità"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={() => setIngredients([...ingredients, { name: '', quantity: '' }])}>Aggiungi Ingrediente</button>
      </div>

      <div>
        <label>Passaggi</label>
        {steps.map((step, index) => (
          <div key={index}>
            <textarea
              placeholder="Descrizione del passaggio"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={() => setSteps([...steps, ''])}>Aggiungi Passaggio</button>
      </div>

      <div>
        <label>Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Breakfast">Colazione</option>
          <option value="Lunch">Pranzo</option>
          <option value="Dinner">Cena</option>
          <option value="Snack">Spuntino</option>
        </select>
      </div>

      <div>
        <label>Note</label>
        <textarea
          placeholder="Note opzionali"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button type="submit">Aggiungi Ricetta</button>
    </form>
  );
};

export default AddRecipe;
