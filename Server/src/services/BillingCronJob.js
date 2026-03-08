import cron from "node-cron";
import { processPendingCharges } from "./DeferredBilling.js";

/**
 * Start a cron job that processes deferred billing charges.
 * Default: runs daily at 02:00.
 * Adjust the cron expression as needed.
 */
export const startBillingCronJob = (cronExpr = "0 2 * * *") => {
  cron.schedule(cronExpr, async () => {
    console.log("[BillingCron] Running deferred billing job...");
    try {
      const result = await processPendingCharges();
      console.log("[BillingCron] Result:", result.processed, "processed");
    } catch (err) {
      console.error("[BillingCron] Error processing deferred billing:", err);
    }
  });

  console.log(`[BillingCron] Scheduled with cron expression: ${cronExpr}`);
};
/**
 * CRON JOB SETUP - Run this periodically to process pending charges
 * 
 * This file shows how to set up an automated job to process deferred billing charges.
 * You can use node-cron or a job queue like Bull.
 */

// Option 1: Using node-cron (simple approach)
// npm install node-cron

// import cron from "node-cron";
// import { processPendingCharges } from "../services/DeferredBilling.js";

// // Run daily at 2 AM
// export const startBillingCronJob = () => {
//   cron.schedule("0 2 * * *", async () => {
//     console.log("🔄 Processing deferred billing charges...");
//     try {
//       const result = await processPendingCharges();
//       console.log("✅ Billing processed:", result);
//     } catch (error) {
//       console.error("❌ Error processing billing:", error);
//     }
//   });

//   console.log("📅 Billing cron job started (runs daily at 2 AM)");
// };

// Option 2: Using Bull for more robust job queue
// npm install bull redis
// import Bull from "bull";
// 
// const billingQueue = new Bull("deferred-billing");
//
// billingQueue.process(async (job) => {
//   return await processPendingCharges();
// });
//
// // Schedule to run every day
// billingQueue.add({}, { repeat: { cron: "0 2 * * *" } });
