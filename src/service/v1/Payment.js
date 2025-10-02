/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/Payment")
const OrderService = require("./Order")
const { PaymentIntent } = require("../../log")
const stripe = require("stripe")("sk_test_51Hk7j0HUz35n7YaqBSyU3YYS0Y9iTjyBuChCZGQsqFbnhA4t1EEKVG34wz5UllepRizXOHKwJCWELdJdDhOXHiVR00Ujk6cqON")
module.exports = new (class Service extends BaseService {
  async CreatePayment(userId, session, cartId) {
    const existClientSecret = await this.findOneByCondition({
      userId,
      cartId,
      statusCode: 0,
    })
    if (existClientSecret) {
      const UpdateObject = await this.update(
        { _id: existClientSecret._id },
        {
          sessionId: session.id,
        },
        true
      )
      return UpdateObject
    }
    const createdObject = await this.createObject({
      statusCode: 0,
      sessionId: session.id,
      cartId,
    })
    return createdObject
  }
})(Model)
