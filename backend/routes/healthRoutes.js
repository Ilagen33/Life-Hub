import express from "express";
import HealthData from "../models/healthData.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/HealthData", 
    authMiddleware, 
    async (req, res, next) => {
    
        try {
            const healthData = new HealthData({
                user: req.user._id,
                ...req.body
            });
            const savedData = await healthData.save();
            res
                .status(201)
                .json(savedData);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/HealthData",
    authMiddleware,
    async (req, res) => {
        try {
        const healthData = await HealthData.find({ user: req.user._id }).sort({date: -1});
        res
            .status(200)
            .json(healthData);
        } catch (error) {
            next(error);        
        }
    }
);

export default router;
