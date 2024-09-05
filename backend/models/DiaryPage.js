import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const DiaryPageSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        tags: [String],
        media: [String],
    },
    {
        collection: "DiaryPages",
        timestamps: true,
    },
);


const DiaryPage = model("DiaryPage", DiaryPageSchema);

export default DiaryPage;