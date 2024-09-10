import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [100, "Il titolo non può superare i 100 caratteri"],
    trim: true,
  },

  description: {
    type: String,
    required: true,
    maxlength: [2500, "Il contenuto non può superare i 2500 caratteri"],
    trim: true,
  },

  points: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },

  completed: {
    type: Boolean,
    default: false,
    trim: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  date: {
    type: Date,
    default: Date.now(),
    validate: {
      validator: function(v) {
          if (v == null) return true;
          return v > Date.now();
      },
      message: 'La data di scadenza deve essere una data futura.'
    },
    trim: true,
  }
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);
export default Challenge;
