// import mongoose from "mongoose"

// const subscriptionPlanSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   durationInDays: Number,
//   description: String,

//   includesDelivery: {
//     type: Boolean,
//     default: false
//   },

//   isActive: { type: Boolean, default: true }
// });

// export default mongoose.model('subscriptionPlan',subscriptionPlanSchema)

import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationDays: { type: Number, required: true },//
  includesDelivery: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
