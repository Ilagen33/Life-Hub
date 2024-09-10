import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500,
  },

  image: {
    type: String,
    validate: {
      validator: function (v) {
          if (v == null) return true;
          return validator.isURL(v);
      },
      message: props => `${props.value} non è un URL valido!`
    },
  },

  preparationTime: {
    type: Number,
    min: 0,
    max: 1000,
  },

  cookingTime: {
    type: Number,
    min: 0,
    max: 1000,
  },

  difficulty: {
    type: String,
    enum: ['Facile', 'Medio', 'Difficile'],
    default: 'Medio',
    trim: true,
  },

  portate: {
    type: Number,
    min: 1,
    max: 100,
    default: 1,
  },

  calories: {
    type: Number,
    min: 0,
    max: 10000,
    default: 0,
    trim: true,
  },

  ingredients: [
    {
      name: String,
      quantity: String,
    },
    {
      name: String,
      quantity: String,
    }
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
