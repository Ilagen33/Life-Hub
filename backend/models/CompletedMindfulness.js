import mongoose from 'mongoose';

const completedMindfulnessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MindfulnessExercise',
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
  },
  
});

const CompletedMindfulness = mongoose.model('CompletedMindfulness', completedMindfulnessSchema);

export default CompletedMindfulness;
