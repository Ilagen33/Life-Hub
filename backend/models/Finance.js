import mongoose from 'mongoose';

const financeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 3,
  },

  type: {
    type: String,
    enum: ['income', 'expense', 'investment', 'debt', 'savings', 'other', 'salary', 'bonus', 'gift', 'refund', 'transfer', 'loan', 'credit', 'payment', 'withdrawal', 'deposit',], 
    // Tipo: entrata o spesa
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 3,
  },

  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 1000000000,
  },

  date: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: function(v) {
          if (v == null) return true;
          return v > Date.now();
      },
      message: 'La data di scadenza deve essere una data futura.'
    },
  },

  note: {
    type: String,
    trim: true,
    maxlength: 500,
    minlength: 3,
    required: false,
    default: 'Nessuna nota',  
  },
});

const Finance = mongoose.model('Finance', financeSchema);

export default Finance;
