/** @format */

const dotEnv = require("dotenv")
const path = require("path")
dotEnv.config({ path: path.join(__dirname, "../../.env") })
// dotEnv.config({ path: path.join(__dirname, "../../.env.local") });

// APP config

const PORT = process.env.PORT
const SECRET_KEY = "wivhbwvbwicv2497t2470r624wdijdcbn982487ryFV:WFNV:WFJVI#%T(%#TG(@UF"
// DB config
const XAPIKEY = "c47c4707-fbad-4bba-9f3b-da7a16cce44d"
const XSANDBOX = 1
const CALL_BACK_IDPAY =
  process.env.MONGO_CONNECTION_TYPE === "production"
    ? "https://api.alexfrostwolf.ir/client/v1/Payment/Verify"
    : "http://localhost:3085/client/v1/Payment/Verify"
const MONGO_CONNECTION_TYPE = process.env.MONGO_CONNECTION_TYPE
const MONGO_CONNECTION_URI_LOCAL = process.env.MONGO_CONNECTION_URI_LOCAL
const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const EXPIRE_VERIFY_CODE_IN_SECONDS = process.env.EXPIRE_VERIFY_CODE_IN_SECONDS
const SEND_ORDER_TO_THERAPIST_PERIOD = process.env.SEND_ORDER_TO_THERAPIST_PERIOD
const SEND_ORDER_TO_THERAPIST_REQUEST_COUNT = process.env.SEND_ORDER_TO_THERAPIST_REQUEST_COUNT
function getBaseUrl() {
  const type = process.env.MONGO_CONNECTION_TYPE

  switch (type) {
    case "production":
      return "https://backend.druck-teleprint.at"
    case "test":
      return "https://backendtest.druck-teleprint.at"
    case "local":
    default:
      return "http://localhost:3085"
  }
}

const BASE_URL_FOR_MULTER = getBaseUrl()

module.exports = {
  PORT,
  MONGO_CONNECTION_TYPE,
  MONGO_CONNECTION_URI,
  MONGO_CONNECTION_URI_LOCAL,
  SECRET_KEY,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  EXPIRE_VERIFY_CODE_IN_SECONDS,
  BASE_URL_FOR_MULTER,
  SEND_ORDER_TO_THERAPIST_PERIOD,
  SEND_ORDER_TO_THERAPIST_REQUEST_COUNT,
  XAPIKEY,
  XSANDBOX,
  CALL_BACK_IDPAY
}
