// import Payment from "../models/Payment.js";
// import User from "../models/User.js";

// export const createPayment = async (req, res) => {
//   try {
//     const { subscriptionId, amount } = req.body;
//     const userId = req.user.id;

//     const user = await User.findById(userId);

//     if (!user.cardcomToken) {
//       return res.status(400).json({
//         message: "אין כרטיס שמור – נדרש תשלום ראשוני",
//       });
//     }

//     const payment = await Payment.create({
//       user: userId,
//       subscription: subscriptionId,
//       amount,
//       cardcomTokenUsed: user.cardcomToken,
//       status: "pending",
//     });

//     // כאן בעתיד: קריאה ל־Cardcom
//     // const result = await chargeWithToken(...)

//     payment.status = "success";
//     await payment.save();

//     res.status(201).json(payment);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בתשלום" });
//   }
// };

// export const getUserPayments = async (req, res) => {
//   const payments = await Payment.find({ user: req.user.id })
//     .populate("SubscriptionPlan");
//   res.json(payments);
// };
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { createLowProfile } from "../services/Cardcom.js";

export const startPayment = async (req, res) => {
  console.log("start");
  
  const userId = req.user.id; 
  
  const { subscriptionId, amount } = req.body;

  // 1. יצירת Payment
  const payment = await Payment.create({
    user: userId,
    suscription: subscriptionId,
    amount
  });

  // 2. יצירת LowProfile בקראדקום
  const lowProfile = await createLowProfile({
    amount,
    paymentId: payment._id.toString()
  });

  // 3. מחזירים ללקוח LowProfileId
  res.json({ lowProfileId: lowProfile });
};

//Callback מקראדקום
export const cardcomCallback = async (req, res) => {
  const {
    ReturnValue,        // paymentId
    ResponseCode,
    InternalDealNumber, // transactionId
    Token
  } = req.body;

  const payment = await Payment.findById(ReturnValue);
  if (!payment) return res.sendStatus(200);

  if (ResponseCode === "0") {
    payment.status = "success";
    payment.cardcomTransactionId = InternalDealNumber;
    await payment.save();

    // שמירת token על המשתמש
    if (Token) {
      await User.findByIdAndUpdate(payment.user, {
        cardcomToken: Token
      });
    }
  } else {
    payment.status = "failed";
    await payment.save();
  }

  res.sendStatus(200);
};
