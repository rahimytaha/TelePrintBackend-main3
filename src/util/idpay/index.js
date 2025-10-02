const axios = require("axios");
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": "df2236f6-8777-4645-84f9-30b031cfc2be",
  "X-SANDBOX": 0,
};

const createPayment = async (data) => {
  const { order_id, amount } = data;

  try {
    const callback = "https://api.hel3y.com/v1/patient/verifyPayment";
    const result = await axios.post(
      "https://api.idpay.ir/v1.1/payment",
      {
        order_id,
        amount,
        callback,
      },
      { headers }
    );
    return result.data;
  } catch (error) {
    return error;
  }
};

const verifyPayment = async (id, order_id) => {
  try {
    const result = await axios.post(
      "https://api.idpay.ir/v1.1/payment/verify",
      {
        id: id,
        order_id: order_id,
      },
      { headers }
    );
    return result.data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};
