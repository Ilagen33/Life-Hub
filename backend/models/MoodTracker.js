import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const MoodTrackerSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        mood: {
            type: String,
            required: true,
            enum: ["happy", "sad", "angry", "neutral", "excited", "bored", "stressed", "anxious", "calm", "tired", "relaxed", "frustrated"], // Add more moods as needed
            default: "neutral",
            trim: true,
        },

        intensity: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
            default: 5,
            trim: true,
        },

        date: {
            type: Date,
            default: Date.now,
            trim: true,
        },

        note: {
            type: String,
            maxlength: 1000,
            default: "",
            trim: true,
        }
    },
    {
        collection: "MoodTrackers",
        timestamps: true,
    },
);

const MoodTracker = model('MoodTracker', MoodTrackerSchema);

export default MoodTracker;