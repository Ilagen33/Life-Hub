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
            min: 1,
            max: 500,
            required: true,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            },
        },

        calories: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            },
            min: 1,
            max: 5000,
        },

        sleepHours: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            },
            min: 1,
            max: 24,
        },

        date: {
            type: Date,
            default: Date.now,
            required: true,
        },

        diet: {
            type: String, // Descrizione della dieta o calorie
            maxLength: 255,
            trim: true,
        },
          
         bloodPressure: {
            systolic: {
                type: Number,
                min: 0,
                max: 300,
                validate: {
                  validator: Number.isInteger,
                  message: "{VALUE} is not an integer value",
                },
              },
              diastolic: {
                type: Number,
                min: 0,
                max: 200,
                validate: {
                  validator: Number.isInteger,
                  message: "{VALUE} is not an integer value",
                },
              },
        },

        heartRate: {
            type: Number,
            min: 0,
            max: 300,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            },
        },
    },
    {
        collection: "HealthDatas",
        timestamps: true,
    },
);

const HealthData = model('HealthData', HealthDataSchema);

export default HealthData;