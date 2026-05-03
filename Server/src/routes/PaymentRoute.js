import express from "express";
import {
  startPayment,
  cardcomCallback,
  getUserPayments
  // purchaseDeferredEdition,
  // processBillingQueue,
  // getEditionBillingStatusEndpoint,
  // cancelUserBillingCharges,
} from "../controllers/PaymentController.js";
import { verifyJWT } from "../middlewares/AuthMiddleware.js";
import { verifyAdmin } from "../middlewares/AdminMiddleware.js";

const router = express.Router();

// ========== IMMEDIATE BILLING ==========
router.post("/start", verifyJWT, startPayment);//האם לעשות לזה verifyAdmin? כאו שכל משתמש יכול להתחיל תשלום
router.post("/cardcomCallback", verifyJWT, cardcomCallback);
router.get("/my", verifyJWT, getUserPayments);// כל התשלומים של משתמש
// // Deferred purchase (user)
// router.post("/purchase/deferred", verifyJWT, purchaseDeferredEdition);

// // Admin routes for deferred billing
// router.post("/deferred/process", verifyJWT, verifyAdmin, processBillingQueue);
// router.get("/deferred/edition/:editionId/status", verifyJWT, verifyAdmin, getEditionBillingStatusEndpoint);
// router.post("/deferred/cancel", verifyJWT, verifyAdmin, cancelUserBillingCharges);

export default router;
