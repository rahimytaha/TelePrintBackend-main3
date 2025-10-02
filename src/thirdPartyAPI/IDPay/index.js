const axios = require("axios");
const path = require("path");
const express = require("express");
const router = express.Router();
const { XAPIKEY, XSANDBOX, CALL_BACK_IDPAY } = require("../../config");

const IdPayBaseUrl = axios.create({
  baseURL: "https://api.idpay.ir/v1.1/payment",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": XAPIKEY,
    "X-SANDBOX": XSANDBOX,
  },
});
async function Payment(data) {
  const result = await IdPayBaseUrl.post("", {
    ...data,
    callback: CALL_BACK_IDPAY,
  });
  return result;
}

async function VerifyMiddleware(req, res, next) {
  try {
    const { data } = await IdPayBaseUrl.post("/verify", {
      id: req.body.id,
      order_id: req.body.order_id,
    });

    res.redirect(`/pay/success?invoiceId=${req.body.order_id}`);
    return data;
  } catch (error) {
    res.redirect(`/pay/failed?invoiceId=${req.body.order_id}`);

    return { FAILED: true };
  }
}
module.exports = {
  IdPayBaseUrl,
  Payment,
  VerifyMiddleware,
};
