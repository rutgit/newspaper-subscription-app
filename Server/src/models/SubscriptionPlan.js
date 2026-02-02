import mongoose from "mongoose"

const subscriptionPlanSchema = new mongoose.Schema({
  name: String,
  price: Number,
  durationInDays: Number,
  description: String,

  includesDelivery: {
    type: Boolean,
    default: false
  },

  isActive: { type: Boolean, default: true }
});

export default mongoose.model('subscriptionPlan',subscriptionPlanSchema)