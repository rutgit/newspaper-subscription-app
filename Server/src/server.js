import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/AuthRoute.js'
import subscriptionRoutes from "./routes/SubscriptionRoute.js";
import userRoute from "./routes/UserRoute.js"
import paymentRoute from "./routes/PaymentRoute.js";

const app = express()
const PORT = process.env.PORT || 1234

connectDB()

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoute)
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payment", paymentRoute);

app.get('/', (req, res) => {
  res.send('app is running')
})

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB')
  app.listen(PORT, () => {
    console.log(`server run on ${PORT}`)
  })
})

mongoose.connection.on('error', err => {
  console.log(err)
})
