import Edition from "../models/Edition.js";
import BillingSchedule from "../models/BillingSchedule.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { createLowProfile } from "./Cardcom.js";
import mongoose from "mongoose";

const addMonthsStart = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const allocateSlot = async (editionId) => {
  const edition = await Edition.findById(editionId);
  if (!edition) throw new Error("Edition not found");

  const publicationMonth = new Date(edition.editionDate);
  publicationMonth.setDate(1);
  publicationMonth.setHours(0, 0, 0, 0);

  for (let i = 0; i < edition.maxBillingMonths; i++) {
    const monthDate = addMonthsStart(publicationMonth, i);
    const count = await BillingSchedule.countDocuments({
      edition: edition._id,
      scheduledMonth: monthDate,
      status: { $in: ["pending", "processing", "charged"] },
    });

    if (count < edition.chargesPerMonth) {
      return { monthDate, monthIndex: i + 1 };
    }
  }

  // overflow: notify admin (caller can handle)
  return null;
};

export const createBillingEntryForPurchase = async ({ userId, editionId, subscriptionId, amount }) => {
  // allocate slot
  const slot = await allocateSlot(editionId);

  const schedule = await BillingSchedule.create({
    edition: editionId,
    user: userId,
    subscription: subscriptionId,
    amount,
    scheduledMonth: slot ? slot.monthDate : null,
    billingMonthIndex: slot ? slot.monthIndex : null,
    status: "pending",
  });

  // increment edition totalPurchases
  await Edition.findByIdAndUpdate(editionId, { $inc: { totalPurchases: 1 } });

  // If over 500 buyers, return flag for admin notification
  const edition = await Edition.findById(editionId);
  if (edition.totalPurchases > 500) {
    // caller should notify admin
  }

  return schedule;
};

export const processPendingCharges = async (processDate = new Date()) => {
  const day = new Date(processDate);
  day.setHours(23, 59, 59, 999);

  // find pending schedules with scheduledMonth <= today
  const pending = await BillingSchedule.find({
    status: "pending",
    scheduledMonth: { $lte: day },
  })
    .sort({ scheduledMonth: 1, createdAt: 1 })
    .limit(500); // safety cap

  const results = { processed: 0, success: [], failed: [], skipped: [] };

  for (const sched of pending) {
    // Respect per-run limit based on business rules (e.g., calls to Cardcom) — caller can limit by calling slice
    try {
      const user = await User.findById(sched.user);
      if (!user) {
        sched.status = "failed";
        sched.failureReason = "User not found";
        await sched.save();
        results.failed.push(sched._id);
        continue;
      }

      if (!user.cardcomToken) {
        sched.status = "skipped";
        sched.failureReason = "No saved card token";
        await sched.save();
        results.skipped.push(sched._id);
        continue;
      }

      // Create Payment record
      const payment = await Payment.create({
        user: user._id,
        suscription: sched.subscription,
        edition: sched.edition,
        amount: sched.amount,
        billingType: "deferred",
        billingScheduleRef: sched._id,
        status: "pending",
      });

      // Call Cardcom to charge using token (here we create LowProfile and pass payment id)
      const low = await createLowProfile({ amount: sched.amount, paymentId: payment._id.toString() });

      // We don't get immediate result here — the Cardcom callback should update the Payment record.
      // For now mark schedule as processing and link payment
      sched.status = "processing";
      sched.paymentRef = payment._id;
      sched.cardcomTokenUsed = user.cardcomToken;
      await sched.save();

      results.success.push({ sched: sched._id, payment: payment._id, lowProfile: low });
      results.processed += 1;
    } catch (err) {
      sched.attempts = (sched.attempts || 0) + 1;
      sched.failureReason = err.message;
      if (sched.attempts >= 3) sched.status = "failed";
      await sched.save();
      results.failed.push({ id: sched._id, reason: err.message });
    }
  }

  return results;
};

export const getEditionBillingStatus = async (editionId) => {
  const edition = await Edition.findById(editionId);
  if (!edition) throw new Error("Edition not found");

  const schedules = await BillingSchedule.find({ edition: editionId });
  const breakdown = schedules.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    },
    { pending: 0, processing: 0, charged: 0, failed: 0, skipped: 0 }
  );

  return {
    edition,
    totalScheduled: schedules.length,
    breakdown,
    completionPercentage: (breakdown.charged / Math.max(1, schedules.length)) * 100,
  };
};

export const cancelUserCharges = async (userId, editionId) => {
  const res = await BillingSchedule.updateMany(
    { user: userId, edition: editionId, status: "pending" },
    { $set: { status: "skipped", failureReason: "Cancelled by admin" } }
  );
  return res;
};

