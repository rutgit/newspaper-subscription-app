import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required: false,
        default: null
    },
    cardcomToken: {
        type: String,
    },

    subscriptionStart: Date,
    subscriptionEnd: Date
});

export default mongoose.model('User', userSchema)

