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
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255,
                unique: true,
            },

            muscleGroup: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255,
            },

            description: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255,
            },
            
            sets: {
                type: Number,
                required: true,
                minlength: 1,
                maxlength: 255,
                default: 1,
            },

            reps: {
                type: Number,
                required: true,
                minlength: 1,
                maxlength: 255,
                default: 1,
            },

            weight: {
                type: Number,
                required: true,
                minlength: 1,
                maxlength: 255,
                default: 1,
            },

            restTime: {
                type: Number,
                required: true,
                minlength: 1,
                maxlength: 255,
                default: 1,
            },
        }],

        goal: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 255,
            default: 'Lose Weight',
        },

        startDate: {
            type: Date,
            required: true,
            trim: true,
            default: Date.now,
            minlength: 3,
            maxlength: 255,
            validate: {
                validator: function (v) {
                    if (v == null) return true;
                    return validator.isURL(v);
                },
                message: props => `${props.value} non è un URL valido!`
            },
        },

        endDate: {
            type: Date,
            required: true,
            trim: true,
            default: Date.now,
            minlength: 3,
            maxlength: 255,
            validate: {
                validator: function (v) {
                    if (v == null) return true;
                    return validator.isURL(v);
                },
                message: props => `${props.value} non è un URL valido!`
            },
        },
    },
    
    {
        collection: "WorkOutPlanners",
        timestamps: true,
    },
);

const WorkoutPlan = model('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;