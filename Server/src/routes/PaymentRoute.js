// import express from "express";
// import {
//   createPayment,
//   getUserPayments,
// } from "../controllers/PaymentController.js";
// import { authMiddleware } from "../middlewares/AuthMiddleware.js";

// const router = express.Router();

// // יצירת תשלום על עיתון
// router.post("/", authMiddleware, createPayment);

// // כל התשלומים של משתמש
// router.get("/my", authMiddleware, getUserPayments);

// export default router;

import express from "express";
import {
  startPayment,
  cardcomCallback,
  purchaseDeferredEdition,
  processBillingQueue,
  getEditionBillingStatusEndpoint,
  cancelUserBillingCharges,
} from "../controllers/PaymentController.js";
import { verifyJWT } from "../middlewares/AuthMiddleware.js";
import { verifyAdmin } from "../middlewares/AdminMiddleware.js";

const router = express.Router();

// ========== IMMEDIATE BILLING ==========
router.post("/start", verifyJWT, startPayment);
router.post("/cardcomCallback", verifyJWT, cardcomCallback);
// Deferred purchase (user)
router.post("/purchase/deferred", verifyJWT, purchaseDeferredEdition);

// Admin routes for deferred billing
router.post("/deferred/process", verifyJWT, verifyAdmin, processBillingQueue);
router.get("/deferred/edition/:editionId/status", verifyJWT, verifyAdmin, getEditionBillingStatusEndpoint);
router.post("/deferred/cancel", verifyJWT, verifyAdmin, cancelUserBillingCharges);

export default router;
