import express from "express";
import HealthData from "../models/healthData.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    "/HealthData", 
    authMiddleware, 
    async (req, res, next) => {
        
        try {
            //PAGINAZIONE
            const page = parseInt(req.query.page) || 1;
            const limite = parseInt(req.query.limit) || 10;
            const ordinamento = req.query.sort || "dueDate";
            const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
            const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
    
            // FILTRI
            const filter = {};
            if (req.query.weight) {
                filter.weight = req.query.weight; // Filtra per weight (ad es., "completed", "pending")
            }
            if (req.query.calories) {
                filter.calories = req.query.calories; // Filtra per categoria (ad es., "work", "personal")
            }
            if (req.query.sleepHours) {
                filter.sleepHours = new Date(req.query.sleepHours); // Filtra per data di scadenza
            }
            if (req.query.date) {
                filter.date = new Date(req.query.date); // Filtra per data di scadenza
            }
            if (req.query.diet) {
                filter.diet = new Date(req.query.diet); // Filtra per data di scadenza
            }
            if (req.query.bloodPressure) {
                filter.bloodPressure = new Date(req.query.bloodPressure); // Filtra per data di scadenza
            }
            if (req.query.heartRate) {
                filter.heartRate = new Date(req.query.heartRate); // Filtra per data di scadenza
            }

            // QUERY AL DATABASE CON FILTRI, ORDINAMENTO E PAGINAZIONE
            //Nella query al database sono integrati: filtri, ordinamento e paginazione
            const healthDatas = await HealtData.find({
                user: req.user._id, 
                ...filter
            })
                .sort({ [ordinamento]: direzOrdine })
                .skip(salta)
                .limit(limite);

            const totale = await HealthData.countDocuments({user: req.user._id});
            
            res
                .status(201)
                .json({
                    healthDatas: healthDatas,
                    currentPage: page,
                    totalPages: Math.ceil(totale / limite),
                    totalItems: totale,
                    message: "HealthData recuperate con successo"
                });
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    "/HealthData",
    [
        body("weight")
            .notEmpty()
            .withMessage("Il peso è obbligatorio")
            .isNumeric()
            .withMessage("Il peso deve essere un numero")
            .isLength({ min: 1 })
            .isLength({ max: 500 })
            .withMessage("Il peso deve essere compreso tra 1 e 500"),

        body("calories")
            .notEmpty()
            .withMessage("Le calorie sono obbligatorie")
            .isNumeric()
            .withMessage("Le calorie devono essere un numero")
            .isLength({ min: 1 })
            .isLength({ max: 500 })
            .withMessage("Le calorie devono essere compreso tra 1 e 500"),

        body("sleepHours")
            .notEmpty()
            .withMessage("Le ore di sonno sono obbligatorie")
            .isNumeric()
            .withMessage("Le ore di sonno devono essere un numero")
            .isLength({ min: 1 })
            .isLength({ max: 24 })
            .withMessage("Le ore di sonno devono essere compreso tra 1 e 24"),

        body("date")
            .notEmpty()
            .withMessage("La data è obbligatoria")
            .isDate()
            .withMessage("La data deve essere una data valida"),

        body("diet")
            .notEmpty()
            .withMessage("La dieta è obbligatoria")
            .isString()
            .withMessage("La dieta deve essere una stringa")
            .isLength({ max: 255 })
            .withMessage("La dieta deve essere compresa tra 1 e 255 caratteri"),
            
        body("bloodPressure")
            .notEmpty()
            .withMessage("La pressione sanguigna è obbligatoria")
            .isNumeric()
            .withMessage("La pressione sanguigna deve essere un numero")
            .isLength({ min: 1 })
            .isLength({ max: 500 })
            .withMessage("La pressione sanguigna deve essere compreso tra 1 e 500"),
            
        body("heartRate")
            .notEmpty()
            .withMessage("La frequenza cardiaca è obbligatoria")
            .isNumeric()
            .withMessage("La frequenza cardiaca deve essere un numero")
            .isLength({ min: 1 })
            .isLength({ max: 300 })
            .withMessage("La frequenza cardiaca deve essere compreso tra 1 e 300"),

    ],
    authMiddleware,
    async (req, res, next) => {
        try {
            // Verifica se ci sono errori di validazione
            const errors = validationResult(req);
                if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ 
                        errors: errors.array() 
                    });
                }
            next();

        const newHealthData = await HealthData.find({
            user: req.user._id,
            ...req.body,
        });

        res
            .status(200)
            .json({
                newHealthData,
                message: "HealthData aggiunto con successo"
            });
            
        } catch (error) {
            next(error);        
        }
    }
);

export default router;
