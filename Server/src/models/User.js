import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: false,
        default: null
    },
    suscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
    },
    cardcomToken: {
        type: String,
    },
    subscriptionStart: Date,
    subscriptionEnd: Date
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

