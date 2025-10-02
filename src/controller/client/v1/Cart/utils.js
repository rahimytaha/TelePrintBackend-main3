const path = require("path")
const fs = require("fs")

async function htmlAddress(htmlName) {
  let files = path.join(__dirname, `../../../../thirdPartyAPI/Stripe/back/${htmlName}`)
  // files = await fs.promises.readFile(files, "utf8")
  return files
}

module.exports = {
  htmlAddress,
}
