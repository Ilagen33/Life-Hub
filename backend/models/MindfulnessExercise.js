import mongoose from 'mongoose';

const mindfulnessExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [100, "Il titolo non può superare i 100 caratteri"],
    unique: true,
    trim: true,
  },
 
  tags: {
    type: [String],
    required: true,
    enum: ['Meditazione', 'Respirazione', 'Visualizzazione', 'Altro', 'Tutti'],
  },

  category: {
    type: String,
    required: true,
    enum: ['Meditazione', 'Respirazione', 'Visualizzazione', 'Altro', 'Tutti'],
    default: 'Tutti',
    trim: true,
  },

  difficulty: {
    type: String,
    required: true,
    enum: ['Facile', 'Medio', 'Difficile'],
    default: 'Facile',
    trim: true,
  },

  imageURL: {
    type: String,
    required: true,
    trim: true,
    default: 'https://images.pexels.com/photos/3760140/pexels-photo-3760140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    validate: {
      validator: function (v) {
          if (v == null) return true;
          return validator.isURL(v);
      },
      message: props => `${props.value} non è un URL valido!`
    },
  },

  audioURL: {
    type: String,
    required: true,
    trim: true,
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    validate: {
      validator: function (v) {
          if (v == null) return true;
          return validator.isURL(v);
      },
      message: props => `${props.value} non è un URL valido!`
    },
  },

  // Altre proprietà dell'esercizio di mindfulness
  instructions: {
    type: String,
    required: true,
    trim: true,
    default: 'Segui le istruzioni fornite nell\'esercizio.',
  },

  description: {
    type: String,
    required: true,
    trim: true,
    default: 'Questo è un esercizio di mindfulness.',
    maxlength: [2000, "La descrizione non può superare i 500 caratteri"],
    minlength: [10, "La descrizione deve contenere almeno 10 caratteri"],
  },

  duration: {
    type: Number, // Durata in minuti
    required: true,
    min: 1,
    max: 60,
    default: 10,
    trim: true,
    validate: {
      validator: function (v) {
          if (v == null) return true;
          return validator.isNumeric(v.toString());
      },
      message: props => `${props.value} non è un numero valido!`
  
    },
  },
  
  mediaURL: {
    type: String, // URL del file video o audio dell'esercizio
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
          if (v == null) return true;
          return validator.isURL(v);
      },
      message: props => `${props.value} non è un URL valido!`
  
    },
  },
  
});

const MindfulnessExercise = mongoose.model('MindfulnessExercise', mindfulnessExerciseSchema);

export default MindfulnessExercise;
