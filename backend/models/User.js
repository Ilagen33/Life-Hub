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
        },

        password: {
            type: String,
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
    const user = this;
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
};

// Genera un token JWT per l'utente
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const User = model("User", userSchema);

export default User;