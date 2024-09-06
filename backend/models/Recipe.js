import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  steps: {
    type: [String], // Lista dei passaggi
    required: true,
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true,
  },
  notes: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
