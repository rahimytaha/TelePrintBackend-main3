/** @format */
const sandbox = true
const isLocal = false
const baseURLOrigin = "https://backend.druck-teleprint.at"
const baseURLOriginTest = "https://backendtest.druck-teleprint.at"
const baseURLLocal = "http://localhost:3085"
const configOriginal = {
  secret_key: "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",
  publish_key: "pk_live_51Hk7j0HUz35n7YaqFBxRTbIf8XWZDpEcM82e8AoifmFQvFRYFInuhyxiQD9jN1i95RpXm6VRU79lIuPqD9uTTU5P00g0OjI7Kf",
  webHook: "whsec_93GNzLnQHudraaMMVfiWddl1c64vJCRQ",
  successUrl: `${baseURLOrigin}/client/v1/cart/verify?session_id={CHECKOUT_SESSION_ID}`,
  cancelURL: `${baseURLOrigin}/client/v1/cart/verify?session_id={CHECKOUT_SESSION_ID}`
}
const configTest = {
  secret_key: "sk_test_51OvNHOAy51nVJGgOH3o4nqE6jIpax9GZc9Y3v1N7yrJQvm5BFcD7mW8RLPHPPIt699YoIglsLPCSN1ePwrSstNH800q3FjRbcJ",
  publish_key: "pk_test_51OvNHOAy51nVJGgODNnpvW2yA699pf3eDsQHp3AWD9Sb0QaMyNYc3hmW37kjgOgltVqnyzaEbhZGKfRPzmxra3yK00nxQzSoov",
  webHook: "whsec_93GNzLnQHudraaMMVfiWddl1c64vJCRQ",
  successUrl: `${baseURLOriginTest}/client/v1/cart/verify?session_id={CHECKOUT_SESSION_ID}`,
  cancelURL: `${baseURLOriginTest}/client/v1/cart/verify?session_id={CHECKOUT_SESSION_ID}`
}

const configTestLocal = {
  secret_key: "sk_test_51OvNHOAy51nVJGgOH3o4nqE6jIpax9GZc9Y3v1N7yrJQvm5BFcD7mW8RLPHPPIt699YoIglsLPCSN1ePwrSstNH800q3FjRbcJ",
  publish_key: "pk_test_51OvNHOAy51nVJGgODNnpvW2yA699pf3eDsQHp3AWD9Sb0QaMyNYc3hmW37kjgOgltVqnyzaEbhZGKfRPzmxra3yK00nxQzSoov",
  webHook: "whsec_93GNzLnQHudraaMMVfiWddl1c64vJCRQ",
  successUrl: `${baseURLLocal}/client/v1/cart/verify?session_id={CHECKOUT_SESSION_ID}`,
  cancelURL: `${baseURLLocal}/client/v1/cart/verify?session_id={CHECKOUT_SESSION_ID}`
}
const config = sandbox ? (isLocal ? configTestLocal : configTest) : configOriginal
module.exports = {
  config
}
