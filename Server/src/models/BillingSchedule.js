// import mongoose from "mongoose";

// const billingScheduleSchema = new mongoose.Schema(
//   {
//     edition: { type: mongoose.Schema.Types.ObjectId, ref: "Edition", required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     subscription: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
//     amount: { type: Number, required: true },
//     scheduledMonth: { type: Date, required: false },
//     billingMonthIndex: { type: Number, required: false },
//     status: { type: String, enum: ["pending", "processing", "charged", "failed", "skipped"], default: "pending" },
//     paymentRef: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
//     cardcomTokenUsed: { type: String },
//     attempts: { type: Number, default: 0 },
//     failureReason: { type: String },
//     chargedAt: { type: Date },
//   },
//   { timestamps: true }
// );

// billingScheduleSchema.index({ scheduledMonth: 1, status: 1 });

// export default mongoose.model("BillingSchedule", billingScheduleSchema);
import mongoose from "mongoose";

const billingScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    edition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Edition",
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      // When this charge should be processed
    },
    chargeMonth: {
      type: Number,
      required: true,
      // Which month of the deferred billing (1, 2, 3, 4...)
    },
    status: {
      type: String,
      enum: ["pending", "charged", "failed", "skipped"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      // Reference to actual payment once charged
    },
    failureReason: String,
    retryCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

// Index for efficient querying
billingScheduleSchema.index({ scheduledDate: 1, status: 1 });
billingScheduleSchema.index({ user: 1, edition: 1 });

export default mongoose.model("BillingSchedule", billingScheduleSchema);
