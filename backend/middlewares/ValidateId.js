import mongoose from 'mongoose';

// Middleware per la validazione dell'ID
const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID non valido" });
    }

    next(); // Se l'ID è valido, passa al prossimo middleware o al controller
};

export default validateObjectId;
