// import axios from "axios";
// import { cardcomConfig } from "../config/cardcom.js";

// export const createLowProfile = async ({ amount, paymentId }) => {
//   const { data } = await axios.post(
//     `${cardcomConfig.baseUrl}/LowProfile/Create`,
//     {
//       TerminalNumber: cardcomConfig.terminal,
//       ApiName: cardcomConfig.apiName,
//       Amount: amount,
//       ReturnValue: paymentId, // חשוב! חוזר ב־callback
//       Tokenize: true,
//       CallbackUrl: `${process.env.SERVER_URL}/api/payments/cardcom-callback`
//     }
//   );

//   return data; // מחזיר LowProfileId
// };


import axios from "axios";
import { cardcomConfig } from "../config/cardcom.js";

// const IS_MOCK = process.env.CARDCOM_MOCK;

export const createLowProfile = async ({ amount, paymentId }) => {
  // if (IS_MOCK) {
  //   // 🌟 Mock – מחזיר LowProfileId דמה
  //   return {
  //     LowProfileId: `DUMMY_${Date.now()}`
  //   };
  // }

  // 🌟 קריאה אמיתית ל־Cardcom
  try {
    console.log({cardcomConfig:cardcomConfig});
    const { data } = await axios.post(
      `${cardcomConfig.baseUrl}/LowProfile/Create`,
      {
        // TerminalNumber: Number(cardcomConfig.terminal),
        TerminalNumber: cardcomConfig.terminal,
        // UserName: cardcomConfig.username,
        // Password: cardcomConfig.password,

        ApiName: cardcomConfig.apiName,
        Amount: amount,
        ReturnValue: paymentId,
        Tokenize: true,
        CallbackUrl: `${process.env.SERVER_URL}/api/payment/cardcom-callback`
      }
    );

    return data;
  } catch (err) {
    console.error("Cardcom API error:", err.response?.data || err.message);
    throw new Error("Failed to create LowProfile");
  }
};
