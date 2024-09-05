import express from 'express';
import WorkoutPlan from '../models/workoutPlan.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/WorkoutPlan", authMiddleware, async (req, res) => {
    try {
        const workoutPlan = new WorkoutPlan({
            user: req.user._id,
            ...req.body
        });

        const savedPlan = await workoutPlan.save();
        res.status(201).json(savedPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.get("/WorkoutPlan", authMiddleware, async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ user: req.user._id });
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/WorkoutPlan/:id", authMiddleware, async (req, res) => {
    try {
        const updatedPlan = await WorkoutPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            {   
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json(updatedPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete(
        "/WorkoutPlan/:id",
        authMiddleware,
        async (req, res) => {
            try {
                const plan = await WorkoutPlan.findById(req.params.id);
                if(!plan) {
                    return res
                        .status(404)
                        .json({ message: "Plan not found" });
                }
                const deletedPlan = await WorkoutPlan.findByIdAndDelete(req.params.id);
                res.status(200).json({ message: "Piano di allenamento eliminato con successo", deletedPlan });
            } catch (error) {
                res
                    .status(500)
                    .json({ message: error.message });
            }
        }
);

export default router;