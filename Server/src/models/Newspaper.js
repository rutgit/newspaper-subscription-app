import mongoose from "mongoose";

const newspaperSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      required: false,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Newspaper", newspaperSchema);
