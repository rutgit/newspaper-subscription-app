import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  includesDelivery: { type: Boolean, default: false }
}, { timestamps: true });

const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionPlan;
