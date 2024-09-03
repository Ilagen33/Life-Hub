import User from "../models/User.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minuti
export const registerUser = async (req, res, next) => {

    const {nome, cognome, email, dataNascita, username, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(user) {
            return res
                .status(400)
                .json({message: "Utente già registrato"})
        }

        const newUser = new User({nome, cognome, email, dataNascita, username, password});
        await newUser.save();

        const token = newUser.generateAuthToken();
        res
            .status(201)
            .json({
                token, 
                message:"Utente registrato con successo", 
                success: true
            });
    
        } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res
                .status(400)
                .json({message: "Credenziali non valide"});
        };

        if(user.lockUntil && user.lockUntil > Date.now()) {
            return res
                .status(400)
                .json({message: "Utente bloccato, riprova tra 15 minuti"});
        };

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            user.loginAttempts += 1;
            if(user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_TIME;
            }
            await user.save();
            return res
                .status(400)
                .json({message: "Credenziali non valide"})
        }

        // Login riuscito: reset dei tentativi e del blocco
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        const token = user.generateAuthToken();

        res
            .status(200)
            .json({
                token,
                message: "Login eseguito con successo"
            })
            .redirect("/Dashboard");
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const updates = req.body;

        if(updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(
                req.user._id, 
                updates, 
                {
                    new: true, 
                    runValidators: true
                }
        ).select("-password");

        if(!user) {
            return res
                .status(404)
                .json({message: "Utente non trovato"});
        }

        res
            .status(200)
            .json({
                user,
                message: "Informazioni aggiornate"
            })
    } catch(err) {
        next(err)
    }
};

export const deleteUser = async (req, res, next) => {
    
    try {
        const user = await User.findByIdAndDelete(req.user._id);

    if(!user) {
        return res
            .status(404)
            .json({message: "Utente non trovato"})
    }

    res
        .status(200)
        .json({message: "Account eliminato con successo"})

    } catch (err) {
        next(err);
    }
};
