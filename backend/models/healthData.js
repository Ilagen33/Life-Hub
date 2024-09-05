import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const HealthDataSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        weight: {
            type: Number,
            required: true
        },

        calories: {
            type: Number,
            required: true
        },

        sleepHours: {
            type: Number,
            required: true
        },

        date: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        collection: "HealthDatas",
        timestamps: true,
    },
);

const HealthData = model('HealthData', HealthDataSchema);

export default HealthData;