import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
  houseNumber: String,
  zipCode: String
}, { _id: false });

export default mongoose.model('address',addressSchema)