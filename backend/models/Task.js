import { Schema, model } from "mongoose";
import mongoose from 'mongoose';
import validator from 'validator';


const TaskSchema = new Schema(
    {   
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'L\'utente è obbligatorio'],
        },

        category: {
            type: String,
            trim: true,
            default:'general',
            index: true,
        },

        title: {
            type: String,
            required: [true, "Il titolo è obbligatorio"],
            trim: true,
            maxlength: [100, "Il titolo non può superare i 100 caratteri"],
            default: 'Task',
            index: true,
        },

        cover: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    if (v == null) return true;
                    return validator.isURL(v);
                },
                message: props => `${props.value} non è un URL valido!`
            },
        },

        dueDate: {
            type: Date,
            validate: {
                validator: function(v) {
                    if (v == null) return true;
                    return v > Date.now();
                },
                message: 'La data di scadenza deve essere una data futura.'
            },
            index: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: [2500, "Il contenuto non può superare i 2500 caratteri"],
        },

        priority: {
            type: String,
            enum: ['bassa', 'media', 'alta'],
            default: 'media',
        },

        status: {
            type: String,
            required: true,
            trim: true,
            enum: {
                values: ['pending', 'completed', 'in-progress'],
                message: 'Lo stato deve essere uno dei seguenti valori: pending, completed, in-progress',
            },
            default: 'pending',
            index: true,
        }
    },
    {
        collection: "tasks",
        timestamps: true,
    }
);

// Definizione di indici composti
TaskSchema.index({ status: 1, dueDate: 1 });
TaskSchema.index({ category: 1, status: 1 });

const Task = model("Task", TaskSchema);

export default Task;