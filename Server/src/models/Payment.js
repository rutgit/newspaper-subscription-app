import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    suscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscriptionPlan",
      required: true,
    },

    amount: {
      type: Number,
      default:1
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    cardcomTransactionId: {//מספר קבלה של התשלום מקראדקום
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
