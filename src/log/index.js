/** @format */

const loggerWinston = require("./baseLogger");
const GeneralPanel = new loggerWinston.getLogger("GeneralPanel");
const GeneralFront = new loggerWinston.getLogger("GeneralFront");
const PaymentIntent = new loggerWinston.getLogger("paymentIntent");
const Paypal = new loggerWinston.getLogger("Paypal");

module.exports = {
  GeneralPanel,
  GeneralFront,
  PaymentIntent,
  Paypal,
};
