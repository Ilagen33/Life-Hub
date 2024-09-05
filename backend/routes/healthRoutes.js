import express from "express";
import HealthData from "../models/healthData.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/HealthData", authMiddleware, async (req, res) => {
    try {
        const healthData = new HealthData({
            user: req.user._id,
            ...req.body
        });
        const savedData = await healthData.save();
        res.status(201).json(healthData);
    } catch (error) {
        res.status(500).json({ error: "Failed to create health data" });
    }
});

router.get("/HealthData", authMiddleware, async (req, res) => {
    try {
        const healthData = await HealthData.find({ user: req.user._id }).sort({date: -1});
        res.status(200).json(healthData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch health data" });
    }

});

export default router;
