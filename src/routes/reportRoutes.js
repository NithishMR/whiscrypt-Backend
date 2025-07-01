import express from "express";
import { submitReport } from "../controllers/reportController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", authMiddleware, submitReport);

export default router;
