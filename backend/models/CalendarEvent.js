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
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reminders: {
    type: [Date], // Date dei promemoria opzionali
  },
  category: {
    type: String,
    enum: ['Appointment', 'Deadline', 'Reminder', 'Event'], // Tipi di evento
  },
  allDay: {
    type: Boolean,
    default: false,
  },
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

export default CalendarEvent;
