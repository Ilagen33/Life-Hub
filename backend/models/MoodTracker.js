import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const MoodTrackerSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mood: {
            type: String,
            required: true,
            enum: ["happy", "sad", "angry", "neutral", "excited", "bored", "stressed", "anxious", "calm", "tired", "relaxed", "frustrated"]
        },

        note: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "MoodTrackers",
        timestamps: true,
    },
);

const MoodTracker = model('MoodTracker', MoodTrackerSchema);

export default MoodTracker;