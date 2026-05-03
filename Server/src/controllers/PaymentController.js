import Payment from "../models/Payment.js";
import User from "../models/User.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import { createLowProfile } from "../services/Cardcom.js";
// import {
//   allocateSlot,
//   createBillingEntryForPurchase,
//   processPendingCharges,
//   getEditionBillingStatus,
//   cancelUserCharges,
// } from "../services/DeferredBilling.js";

// ========== IMMEDIATE BILLING (existing functionality) ==========

export const startPayment = async (req, res) => {
  console.log("start");
  
  const userId = req.user.id; 
  const { subscriptionId } = req.body;//סוג מנוי

  const subscription = await SubscriptionPlan.findById(subscriptionId);
  if (!subscription) {
    return res.status(400).json({ message: "Subscription not found" });
  }

  const amount = subscription.price;

  // 1. יצירת Payment
  const payment = await Payment.create({
    user: userId,
    suscription: subscriptionId,
    amount
  });

  // 2. יצירת LowProfile בקראדקום
  const lowProfile = await createLowProfile({
    amount,
    paymentId: payment._id.toString()
  });

  // 3. מחזירים ללקוח LowProfileId
  res.json({ lowProfileId: lowProfile });
};

//Callback מקראדקום
export const cardcomCallback = async (req, res) => {
  const {
    ReturnValue,        // paymentId
    ResponseCode,
    InternalDealNumber, // transactionId
    Token
  } = req.body;

  const payment = await Payment.findById(ReturnValue);
  if (!payment) return res.sendStatus(200);

  if (ResponseCode === "0") {
    payment.status = "success";
    payment.cardcomTransactionId = InternalDealNumber;
    await payment.save();

    // שמירת token על המשתמש
    if (Token) {
      await User.findByIdAndUpdate(payment.user, {
        cardcomToken: Token
      });
    }
  } else {
    payment.status = "failed";
    await payment.save();
  }

  res.sendStatus(200);
};

export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('suscription', 'name price');

    res.json({ payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load payments', error: err.message });
  }
};

// // ========== DEFERRED FLOW: called when a user purchases a deferred-edition
// export const purchaseDeferredEdition = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { editionId, subscriptionId, amount } = req.body;

//     if (!editionId || !subscriptionId || !amount) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const schedule = await createBillingEntryForPurchase({
//       userId,
//       editionId,
//       subscriptionId,
//       amount,
//     });

//     // If slot was not allocated, notify admin (frontend can surface message)
//     if (!schedule.scheduledMonth) {
//       return res.status(201).json({ message: "Purchase accepted, awaiting admin review (overflow)", schedule });
//     }

//     res.status(201).json({ message: "Purchase scheduled", schedule });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to schedule purchase", error: err.message });
//   }
// };

// // Admin: process pending charges (can be called by cron)
// export const processBillingQueue = async (req, res) => {
//   try {
//     if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin required" });
//     const { processDate } = req.body;
//     const result = await processPendingCharges(processDate ? new Date(processDate) : new Date());
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Processing failed", error: err.message });
//   }
// };

// export const getEditionBillingStatusEndpoint = async (req, res) => {
//   try {
//     if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin required" });
//     const { editionId } = req.params;
//     const status = await getEditionBillingStatus(editionId);
//     res.json(status);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get status", error: err.message });
//   }
// };

// export const cancelUserBillingCharges = async (req, res) => {
//   try {
//     if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin required" });
//     const { userId, editionId } = req.body;
//     if (!userId || !editionId) return res.status(400).json({ message: "Missing fields" });
//     const result = await cancelUserCharges(userId, editionId);
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Cancel failed", error: err.message });
//   }
// };

