import express from 'express';
import DiaryPage from '../models/DiaryPage.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { query, body, validationResult } from 'express-validator';
import validateObjectId from '../middlewares/ValidateId.js';
import upload from '../middlewares/uploadImage.js';

const router = express.Router();

router.post(
    '/diary',
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a string')
            .isLength({ max: 100 })
            .withMessage('Title must be at most 100 characters')
            .trim(),
        
        body('content')
            .notEmpty()
            .withMessage('Content is required')
            .isString()
            .withMessage('Content must be a string')
            .isLength({ max: 1000 })
            .withMessage('Content must be at most 1000 characters')
            .isLength({ min: 10 })
            .withMessage('Content must be at least 10 characters')
            .trim(),
        
        body('date')
            .optional()
            .isDate(),
    ],
    authMiddleware,
    upload.single('media'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ 
                    errors: errors.array() 
            });
        }
        next();
        try {
            const newDiaryPage = new DiaryPage({
                user: req.user._id,
                ...req.body,
            });
            const savedDiaryPage = await newDiaryPage.save();
            res
                .status(201)
                .json({
                    savedDiaryPage,
                    message:"Nuova pagina aggiunta"
                });
        } catch (error) {
            next(error);
        }
    
    }
);

router.get('/diary', authMiddleware, async (req, res) => {
    try {
         //PAGINAZIONE
         const page = parseInt(req.query.page) || 1;
         const limite = parseInt(req.query.limit) || 10;
         const ordinamento = req.query.sort || "dueDate";
         const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
         const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
     
         // FILTRI
         const filter = {};
         if (req.query.title) {
             filter.title = req.query.title; // Filtra per status (ad es., "completed", "pending")
         }
         if (req.query.tags) {
             filter.tags = req.query.tags; // Filtra per categoria (ad es., "work", "personal")
         }
         if (req.query.date) {
             filter.date = new Date(req.query.date); // Filtra per data di scadenza
         }
        const diaryPages = await DiaryPage.find({
            user: req.user._id,
            ...filter,        
        })
            .sort({ [ordinamento]: direzOrdine })
            .skip(salta)
            .limit(limite);
        
        const totalDiaryPages = await DiaryPage.countDocuments({user: req.user._id});

        res
            .status(200)
            .json({
                diaryPages: diaryPages,
                currentPage: page,
                totalPages: Math.ceil(totalDiaryPages / limite),
                totalItems: totalDiaryPages,
                message: "Diary pages retrieved successfully"
            });

    } catch (error) {
        next(error);
    }
});

router.get(
    '/diary/:id', 
    authMiddleware, 
    validateObjectId,
    async (req, res, next) => {
    try {
        const diaryPage = await DiaryPage.findById(req.params.id);

        if (!diaryPage || diaryPage.user.toString() !== req.user._id.toString()){
            const error = new Error('Diary page not found');

            return res
                .status(404)
                .json({ error: 'Diary page not found' });
        }

        res
            .status(200)
            .json({
                diaryPage,
                message: "Diary page retrieved successfully"
            });
    } catch (error) {
        next(error);
    }
});

router.put(
    '/diary/:id',
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a string')
            .isLength({ max: 100 })
            .withMessage('Title must be at most 100 characters')
            .trim(),
        
        body('content')
            .notEmpty()
            .withMessage('Content is required')
            .isString()
            .withMessage('Content must be a string')
            .isLength({ max: 1000 })
            .withMessage('Content must be at most 1000 characters')
            .isLength({ min: 10 })
            .withMessage('Content must be at least 10 characters')
            .trim(),
        
        body('date')
            .optional()
            .isDate(),
    ],
    authMiddleware,
    validateObjectId,
    upload.single('media'),
    async (req, res, next) => {
         // Verifica se ci sono errori di validazione
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ 
                    errors: errors.array() 
                });
        };

        // Verifica se almeno un campo è stato fornito
        //Object.keys() è un metodo JavaScript che restituisce un array contenente tutte le chiavi enumerabili di un oggetto
        //Quindi se il corpo della richiesta non inserisce nessuna proprietà dell'oggetto restituisce errore
        if (Object.keys(req.body).length === 0) {
            return res
                .status(400)
                .json({ 
                    message: "Nessun dato fornito per l'aggiornamento"
                });
        };

        // Controlli a livello di applicazione
        //Ci assicuriamo che le modifiche siano consentite
        const allowedUpdates = ['title', 'content', 'tags', 'date', 'media'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res
                .status(400)
                .json({ message: "Aggiornamento non valido!" });
        }

        const { id } = req.params;
        const update = req.body;

    try {
        const updatedDiaryPage = await DiaryPage.findByIdAndUpdate(
            {
                _id: id,
                user: req.user._id,
            },
            update,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!updatedDiaryPage || DiaryPage.user.toString() !== req.user._id.toString()){
            return res
                .status(404)
                .json({ error: 'Diary page not found' });
        }
        
        res
            .status(200)
            .json({
                updatedDiaryPage,
                message: "Diary page updated successfully"
            });

    } catch (error) {
        next(error);
    }
});

router.delete(
    '/diary/:id', 
    authMiddleware, 
    validateObjectId,
    async (req, res, next) => {
        try {
            const {id} = req.params;

            const deletedDiaryPage = await DiaryPage.findById({
                _id: id,
                user: req.params.id
            });

            if (!deletedDiaryPage || DiaryPage.user.toString() !== req.user._id.toString()){
                return res
                    .status(404)
                    .json({ error: 'Diary page not found' });
            }

            await DiaryPage.findByIdAndDelete(req.params.id);

            res
                .status(200)
                .json({ message: 'Diary page deleted successfully' });
                
        } catch (error) {
            next(error);
        }
    }
);

export default router;