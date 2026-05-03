import express from "express";
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from "../controllers/SubscriptionController.js";

import { verifyJWT } from "../middlewares/AuthMiddleware.js";
import { verifyAdmin } from "../middlewares/AdminMiddleware.js";
const router = express.Router();

router.get("/", verifyJWT, getSubscriptions);

router.get("/:id", verifyJWT, getSubscriptionById);

// POST יצירת מנוי חדש – רק מנהל
router.post("/", verifyJWT, verifyAdmin, createSubscription);

// PUT עדכון מנוי – רק מנהל
router.put("/:id", verifyJWT, verifyAdmin, updateSubscription);

// DELETE מחיקת מנוי – רק מנהל
router.delete("/:id", verifyJWT, verifyAdmin, deleteSubscription);

export default router;
