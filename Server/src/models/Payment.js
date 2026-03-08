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

      edition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Edition",
      },

      amount: {
        type: Number,
        default: 1,
      },

      billingType: {
        type: String,
        enum: ["immediate", "deferred"],
        default: "immediate",
      },

      billingScheduleRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BillingSchedule",
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
