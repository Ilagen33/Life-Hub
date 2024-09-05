import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const workoutPlanSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        exercises: [{
            name: {
                type: String,
                required: true
            },
            sets: {
                type: Number,
                required: true
            },
            reps: {
                type: Number,
                required: true
            },
            weight: {
                type: Number,
                required: true
            }
        }],

        goal: {
            type: String,
            required: true,
            trim: true,
        },

        startDate: {
            type: Date,
            required: true,
            trim: true,
        },

        endDate: {
            type: Date,
            required: true,
            trim: true,
        },
    },
    {
        collection: "WorkOutPlanners",
        timestamps: true,
    },
);

const WorkoutPlan = model('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;