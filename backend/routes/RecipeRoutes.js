import express from 'express';
import Recipe from '../models/Recipe.js';
import MealPlan from '../models/MealPlan.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotta per aggiungere una nuova ricetta
router.post('/add', protect, async (req, res) => {
  const { name, ingredients, steps, category, notes } = req.body;
  
  try {
    const newRecipe = new Recipe({ name, ingredients, steps, category, notes });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio della ricetta.' });
  }
});

// Rotta per ottenere tutte le ricette
router.get('/', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero delle ricette.' });
  }
});

// Rotta per pianificare i pasti della settimana
router.post('/meal-plan', protect, async (req, res) => {
  const { week, year, meals } = req.body;

  try {
    const mealPlan = new MealPlan({
      user: req.user._id,
      week,
      year,
      meals,
    });

    const savedMealPlan = await mealPlan.save();
    res.status(201).json(savedMealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la pianificazione dei pasti.' });
  }
});

// Rotta per ottenere il piano settimanale dei pasti
router.get('/meal-plan/:week/:year', protect, async (req, res) => {
  const { week, year } = req.params;

  try {
    const mealPlan = await MealPlan.findOne({ user: req.user._id, week, year }).populate('meals.recipe');
    if (mealPlan) {
      res.status(200).json(mealPlan);
    } else {
      res.status(404).json({ error: 'Piano settimanale non trovato.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero del piano settimanale dei pasti.' });
  }
});

export default router;
