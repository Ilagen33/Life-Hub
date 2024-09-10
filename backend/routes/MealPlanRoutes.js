import express from 'express';
import MealPlan from '../models/MealPlan.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Middleware di autenticazione

const router = express.Router();

// Rotta per pianificare i pasti della settimana
router.post(
    '/MealPlan', 
    [
        body("week")
            .notEmpty()
            .withMessage("La settimana è obbligatoria.")
            .isNumber()
            .withMessage("La settimana deve essere un numero.")
            .custom((value) => {
                const weekNumber = parseInt(value);
                return weekNumber >= 1 && weekNumber <= 52;
            }),

        body("year")
            .notEmpty()
            .withMessage("L'anno è obbligatorio.")
            .isNumber()
            .withMessage("L'anno deve essere un numero.")
            .custom((value) => {
                const yearNumber = parseInt(value);
                const currentYear = new Date().getFullYear();
                return yearNumber >= currentYear && yearNumber <= currentYear + 1;
            }),
        
            body("meals")
            .isArray()
            .withMessage("I pasti devono essere un array.")
            .custom((value) => {
                return value.every((meal) => {
                    return meal.dayOfWeek && meal.recipe && meal.category;
                });
            }),
            
    ],
    authMiddleware, 
    async (req, res, next) => {
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
    }
);   
  
  // Rotta per ottenere il piano settimanale dei pasti
  router.get('/MealPlan', authMiddleware, async (req, res) => {
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
