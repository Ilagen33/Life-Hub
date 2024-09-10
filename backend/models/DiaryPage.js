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
            trim: true,
            maxlength: [100, "Il titolo non può superare i 100 caratteri"],
            default: "Nuova pagina",
        },

        content: {
            type: String,
            required: true,
            trim: true,
            default: "Inserisci il tuo testo qui",
            maxlength: [10000, "Il testo non può superare i 10000 caratteri"],
            minlength: [10, "Il testo deve contenere almeno 10 caratteri"],
            default: "Inserisci il tuo testo qui",
        },

        date: {
            type: Date,
            default: Date.now(),
            validate: {
                validator: function(v) {
                    if (v == null) return true;
                    return v > Date.now();
                },
                message: 'La data di scadenza deve essere una data futura.'
            },
        },

        tags: {
            type: String,
            trim: true,
            maxlength: [100, "I tag non possono superare i 100 caratteri"],
            default: "",
        },

        media: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    if (v == null) return true;
                    return validator.isURL(v);
                },
                message: props => `${props.value} non è un URL valido!`
            },
            default: "",
        },

    },
    
    {
        collection: "DiaryPages",
        timestamps: true,
    },
);


const DiaryPage = model("DiaryPage", DiaryPageSchema);

export default DiaryPage;