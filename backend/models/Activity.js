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
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },

        date: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
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