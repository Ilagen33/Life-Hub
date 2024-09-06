import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
        },

        cognome: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        username: {
            type: String,
            trim: true
        },

        dataNascita: {
            type: Date,
            required: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
        },

        loginAttempts: {
            type: Number,
            default: 0,
        },

        isLocked: {
            type: Date,
        },

        googleId: {
            type: String,
        }
    },
    {
        collection: "users",
        timestamps: true,
    }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Confronta la password inserita con quella criptata
userSchema.methods.comparePassword = async function(candidatePassword) {
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
};

// Genera un token JWT per l'utente
userSchema.methods.generateAuthToken = function() {
    // Genera e ritorna direttamente il token senza assegnarlo a una variabile 'token'
    return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


const User = model("User", userSchema);

export default User;