import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllReports,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/user/:userId", authMiddleware, adminMiddleware, deleteUser);
router.get("/reports", authMiddleware, adminMiddleware, getAllReports);

export default router;
