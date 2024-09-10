import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      minlength: 3,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      minlength: 1,
    },

    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
        minlength: 1,
        default: 'Other',
      }
    ],

    category: {
      type: String,
      enum: ['Lecture', 'Study', 'Project', 'Other', 'Personal', 'Work', 'Family', 'Friends', 'Health', 'Finance', 'Travel', 'Entertainment', 'Education', 'Sports', 'Hobbies', 'Art', 'Music', 'Movies', 'Books', 'Food', 'Drinks', 'Clothing', 'Beauty', 'Home', 'Garden', 'Pets', 'Technology', 'Science', 'History', 'Geography', 'Nature', 'Animals', 'Weather', 'Health', 'Finance', 'Travel',],
      default: 'Other',
      trim: true,
      maxlength: 50,
      minlength: 1,
    },
  
  },
  {
    collection: "HealthDatas",
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
