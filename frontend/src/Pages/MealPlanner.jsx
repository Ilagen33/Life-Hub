//MealPlanner.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const MealPlanner = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await axiosInstance.get('/Recipe', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
        },
      });
      setRecipes(response.data);
    };
    if(authToken) {
    fetchRecipes();
    }
  }, [authToken]);

  const handleSelectRecipe = (day, category, recipeId) => {
    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [category]: recipeId,
      },
    }));
  };

  const handleSubmitMealPlan = async () => {
    try {
      const week = new Date().getWeek(); // Funzione per ottenere la settimana corrente
      const year = new Date().getFullYear();
      const meals = Object.keys(mealPlan).flatMap((day) => (
        Object.keys(mealPlan[day]).map((category) => ({
          day,
          category,
          recipe: mealPlan[day][category],
        }))
      ));

      await axiosInstance.post('/MealPlan', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
        },
      },
       { week, year, meals });
      alert('Piano settimanale dei pasti salvato con successo!');
    } catch (error) {
      console.error('Errore durante il salvataggio del piano settimanale dei pasti:', error);
    }
  };

  return (
    <div>
      <h2>Pianificazione dei Pasti Settimanali</h2>
      <table>
        <thead>
          <tr>
            <th>Giorno</th>
            <th>Colazione</th>
            <th>Pranzo</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {['Breakfast', 'Lunch', 'Dinner'].map((category) => (
                <td key={category}>
                  <select onChange={(e) => handleSelectRecipe(day, category, e.target.value)}>
                    <option value="">Seleziona una ricetta</option>
                    {recipes.map((recipe) => (
                      <option key={recipe._id} value={recipe._id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmitMealPlan}>Salva Piano Settimanale</button>
    </div>
  );
};

export default MealPlanner;
