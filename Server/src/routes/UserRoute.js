import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/UserController.js";

import { verifyJWT } from "../middlewares/AuthMiddleware.js";
import { verifyAdmin } from "../middlewares/AdminMiddleware.js";

const router = express.Router();

// Admin – כל המשתמשים
router.get("/", verifyJWT, verifyAdmin, getUsers);

// משתמש בודד
router.get("/:id", verifyJWT, getUserById);

// עדכון פרטים אישיים
router.put("/:id", verifyJWT, updateUser);

// מחיקה
router.delete("/:id", verifyJWT, verifyAdmin, deleteUser);

export default router;
