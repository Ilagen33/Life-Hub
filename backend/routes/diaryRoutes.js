import express from 'express';
import DiaryPage from '../models/DiaryPage.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
import { query, body, validationResult } from 'express-validator';
import cloudinaryUploader from '../config/cloudinaryConfig.js';

router.post(
    '/diary',
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .trim(),
        
        body('content')
            .notEmpty()
            .withMessage('Content is required')
            .trim(),
        
        body('date')
            .optional(),
    ],
    authMiddleware,
    cloudinaryUploader.single('media'),
    async (req, res, next) => {
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
    
});

router.get('/diary', authMiddleware, async (req, res) => {
    try {
        const diaryPages = await DiaryPage.find({ user: req.user._id }).sort({ createdAt: -1});
        res
            .status(200).json(diaryPages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch diary pages' });
    }
});

router.get('/diary/:id', authMiddleware, async (req, res) => {
    try {
        const diaryPage = await DiaryPage.findById(req.params.id);
        if (!diaryPage || diaryPage.user.toString() !== req.user._id.toString()){
            return res.status(404).json({ error: 'Diary page not found' });
        }
        res
            .status(200).json(diaryPage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch diary page' });
    }
});

router.put(
    '/diary/:id', 
    authMiddleware, 
    cloudinaryUploader.single('media'),
    async (req, res) => {
    try {
        const diaryPage = await DiaryPage.findById(req.params.id);
        if (!diaryPage || diaryPage.user.toString() !== req.user._id.toString()){
            return res.status(404).json({ error: 'Diary page not found' });
        }
        diaryPage.title = req.body.title || diaryPage.title;
        diaryPage.content = req.body.content || diaryPage.content;
        const updatedDiaryPage = await diaryPage.save();
        res
            .status(200).json(updatedDiaryPage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update diary page' });
    }
});

router.delete('/diary/:id', authMiddleware, async (req, res, next) => {
    try {
        const diaryPage = await DiaryPage.findById(req.params.id);
        if (!diaryPage || diaryPage.user.toString() !== req.user._id.toString()){
            return res.status(404).json({ error: 'Diary page not found' });
        }
        await DiaryPage.findByIdAndDelete(req.params.id);
        res
            .status(200).json({ message: 'Diary page deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;