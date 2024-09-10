import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  title: {
    type: String,
    required: true,
    maxlength: [100, "Il titolo non può superare i 100 caratteri"],
    trim: true,
  },

  description: {
    type: String,
    maxlength: [500, "La descrizione non può superare i 500 caratteri"],
    trim: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
          if (v == null) return true;
          return v > Date.now();
      },
      message: 'La data di scadenza deve essere una data futura.'
    },
  },

  reminders: {
    type: Date,
    trim: true,
    default: Date.now() // Date dei promemoria opzionali
  },
  
  category: {
    type: String,
    enum: ['Appointment', 'Deadline', 'Reminder', 'Event'], // Tipi di evento
    default: 'Reminder',
    trim: true,
  },

  allDay: {
    type: Boolean,
    default: false,
  },
  
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

export default CalendarEvent;
