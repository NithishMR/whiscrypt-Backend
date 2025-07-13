import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllReports,
  getReport,
  adminRegister,
  adminLogin,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/user/:userId", authMiddleware, adminMiddleware, deleteUser);
router.get("/reports", authMiddleware, getAllReports);
router.get("/reports/:id", authMiddleware, getReport);
router.post("/register", adminRegister);
router.post("/login", adminLogin);
export default router;
