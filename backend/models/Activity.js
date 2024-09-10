import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const ActivitySchema = new Schema(
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
            maxlength: [100, "Il titolo non può superare i 100 caratteri"],
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },

        date: {
            type: Date,
            default: Date.now,
            validate: {
                validator: function(v) {
                    if (v == null) return true;
                    return v > Date.now();
                },
                message: 'La data di scadenza deve essere una data futura.'
            },
        },

        status: {
            type: String,
            enum: {
                values: ['pending', 'completed', 'in-progress'],
                message: 'Lo stato deve essere uno dei seguenti valori: pending, completed, in-progress',
            },
            default: "pending",
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    {
        collection: "Activities",
        timestamps: true,
    },
);


const Activity = model("Activity", ActivitySchema);

export default Activity;