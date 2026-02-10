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
  cardcomCallback
} from "../controllers/PaymentController.js";
import { verifyJWT } from "../middlewares/AuthMiddleware.js";
import { verifyAdmin } from "../middlewares/AdminMiddleware.js";

const router = express.Router();

router.post("/start",verifyJWT,  startPayment);
router.post("/cardcomCallback",verifyJWT, cardcomCallback);

export default router;
