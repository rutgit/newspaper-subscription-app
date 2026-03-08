// import mongoose from "mongoose";

// const editionSchema = new mongoose.Schema(
//   {
//     editionDate: { type: Date, required: true },
//     pdfUrl: { type: String, required: true },
//     billingType: { type: String, enum: ["immediate", "deferred"], default: "immediate" },
//     chargesPerMonth: { type: Number, default: 100 },
//     maxBillingMonths: { type: Number, default: 5 },
//     totalPurchases: { type: Number, default: 0 },
//     status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Edition", editionSchema);
import mongoose from "mongoose";

const editionSchema = new mongoose.Schema(
  {
    editionDate: {
      type: Date,
      required: true,
      unique: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    totalSubscribers: {
      type: Number,
      default: 0,
    },
    billingType: {
      type: String,
      enum: ["immediate", "deferred"],
      required: true,
      // immediate = charge all at once
      // deferred = spread over months
    },
    billingMonths: {
      type: Number,
      default: 1,
      // How many months to spread the billing
    },
    chargesPerMonth: {
      type: Number,
      default: 100,
      // Cardcom limit
    },
    totalCharged: {
      type: Number,
      default: 0,
      // Track how many customers have been billed
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Edition", editionSchema);
