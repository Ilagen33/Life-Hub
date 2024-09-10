import express from "express";
import Finance from "../models/Finance.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { query, body, validationResult } from 'express-validator';
import validateObjectId from "../middlewares/ValidateId.js";

const router = express.Router();


router.get(
    '/budget',
    authMiddleware,
    async (req, res, next) => {

    const { startDate, endDate, category } = req.query;
    
    const filters = { user: req.user._id };
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) {
      filters.category = category;
    }
  
    try {
      const finances = await Finance.find(filters);
      res.status(200).json(finances);
    } catch (error) {
      next(error);
    }
  }
);
  