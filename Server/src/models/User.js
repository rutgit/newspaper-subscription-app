import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,

  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: false,
    default: null
  },

  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
    default: null
  },

  subscriptionStart: Date,
  subscriptionEnd: Date
});

export default mongoose.model('User', userSchema)

