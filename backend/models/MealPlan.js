import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  week: {
    type: Number, // Settimana dell'anno
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  meals: [
    {
      day: String, // Es. "Monday", "Tuesday"
      category: String, // Es. "Breakfast", "Lunch", "Dinner"
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    },
  ],
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
