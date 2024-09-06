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
    default: Date.now,
  },
});

const CompletedMindfulness = mongoose.model('CompletedMindfulness', completedMindfulnessSchema);

export default CompletedMindfulness;
