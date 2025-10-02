const { config } = require("../../config/stripe")

const stripe = require("stripe")(config.secret_key)

async function createPaymentIntent(cart) {
  // const line_items = cart.orderItems.map((item) => {
  //   return {
  //     price_data: {
  //       currency: "eur",
  //       product_data: {
  //         name: item.productName,
  //       },
  //       unit_amount: item?.tableId?.finalPrice * 100, // Price in cents
  //     },
  //     quantity: 1,
  //   }
  // })

  const line_items = [
    {
      price_data: {
        currency: "eur", // Set the currency to euros
        product_data: {
          name: "Teleprint"
        },
        unit_amount: cart.finalPrice * 100
      },
      quantity: 1
    }
  ]

  const sessionObject = {
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    success_url: config.successUrl,
    cancel_url: config.cancelURL
  }

  const session = await stripe.checkout.sessions.create(sessionObject)
  return session
}

async function sessionRetriever(session_id) {
  const session = await stripe.checkout.sessions.retrieve(session_id)
  return session.payment_status === "paid"
}
module.exports = {
  createPaymentIntent,
  sessionRetriever
}
