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
    min: 1,
    max: 52,
  },

  year: {
    type: Number,
    required: true,
    min: 2024,
    max: 2050,
    default: new Date().getFullYear(),
  },
  
  meals: [
    {
      day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: 'Monday',
      },
      
      category: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        default: 'Lunch',
      },

      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        validate: {
          validator: function (value) {
            return value === null || mongoose.Types.ObjectId.isValid(value);
          },
          message: 'Invalid recipe ID',
        },
      },

      recipeName: {
        type: String,
        trim: true,
        maxlength: 255,
        default: 'Nessun piatto selezionato',
      },

      recipeImage: {
        type: String,
        trim: true,
        maxlength: 255,
        default: 'https://via.placeholder.com/150',
        validate: {
          validator: function (value) {
            return value === null || value.startsWith('https://');
          },
          message: 'Invalid image URL',
        },
        validate: {
          validator: function (v) {
              if (v == null) return true;
              return validator.isURL(v);
          },
          message: props => `${props.value} non è un URL valido!`
        },
      },

      recipeDescription: {
        type: String,
        trim: true,
        maxlength: 255,
        default: 'Nessuna descrizione disponibile',
      },
      
      recipeIngredients: [
        {
          ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient',
            required: true,
          },

          quantity: {
            type: Number,
            required: true,
            min: 0,
            max: 3000,
            default: 0,
          },

          unit: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            default: 'g',
            validate: {
              validator: function (v) {
                  if (v == null) return true;
                  return validator.isIn(v, ['g', 'ml', 'unit']);
              },
              message: props => `${props.value} non è un'unità di misura valida!`
            },
          },
        }
      ],

      recipeInstructions: [
        {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
          default: 'Nessuna istruzione disponibile',
        },

      ],

      recipeNutrition: {
        calories: {
          type: Number,
          min: 0,
          default: 0,
        },

        protein: {
          type: Number,
          min: 0,
          default: 0,
        },

        carbohydrates: {
          type: Number,
          min: 0,
          default: 0,
        },

        fat: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
      
      recipeTags: {
        type: [String],
        maxlength: 50,
        default: [],
      },
      
      recipeAllergens: {
        type: [String],
        maxlength: 50,
        default: [],
      },

      recipeDiet: {
        type: String,
        trim: true,
        maxlength: 100,
        default: 'Nessuna dieta selezionata',
      },

      recipeCuisine: {
        type: String,
        maxlength: 100,
        default: 'Nessuna cucina selezionata',
      },

      recipeServings: {
        type: Number,
        min: 1,
        max: 50,
        default: 1,
      },

      recipePrepTime: {
        type: Number,
        min: 0, // In minuti
        default: 0,
      },

      recipeCookTime: {
        type: Number,
        min: 0, // In minuti
        default: 0,
      },

      recipeTotalTime: {
        type: Number,
        min: 0, // In minuti
        default: 0,
        calculate: function () {
          return this.recipePrepTime + this.recipeCookTime;
        },
      },

      recipeYield: {
        type: Number,
        min: 1,
        max: 50,
        default: 1,
        calculate: function () {
          return this.recipeServings;
        },
      },

      recipeAuthor: {
        type: String,
        trim: true,
        maxlength: 100,
        default: 'Nessun autore selezionato',
      },

      recipeSource: {
        type: String,
        trim: true,
        maxlength: 255,
        default: 'Nessuna fonte selezionata',
      },

      recipeVideo: {
        type: String,
        trim: true,
        maxlength: 255,
        default: 'Nessun video disponibile',
      },

      recipeRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      recipeComments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',

          },
          
          text: {
            type: String,
            trim: true,
            maxlength: 500,
          },
          
          rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
          },

          createdAt: {
            type: Date,
            default: Date.now,
          },

        },

      ],
      
      isCompleted: {
        type: Boolean,
        default: false,
      },
      
      isFavorited: {
        type: Boolean,
        default: false,
      },
      
    },
  ],
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
