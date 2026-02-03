import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique:true},
    isAdmin: { type: Boolean, required: true, default: false },
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

