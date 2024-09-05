import express from "express";
import MoodTracker from "../models/MoodTracker.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/MoodTracker", authMiddleware, async (req, res) => {
    try {
        const Mood = new MoodTracker({
            user: req.user._id,
            ...req.body
        });

        const savedMoodTracker = await Mood.save();
        res.status(201).json(savedMoodTracker);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/MoodTracker", authMiddleware, async (req, res) => {
    try {
        const moods = await MoodTracker.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json(moods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;