/** @format */
const local = true
const localPrint = {
  Host: "mail.druck-teleprint.at",
  Port: 465,
  EmailAddress: "shop@druck-teleprint.at",
  Password: "g4;Ari48QV3b",
  ReplyEmailAddress: "print@teleprint.at"
}

const druckTelePrint = {
  Host: "127.0.0.1",
  Port: 465,
  EmailAddress: "shop@druck-teleprint.at",
  Password: "g4;Ari48QV3b",
  ReplyEmailAddress: "print@teleprint.at"
}

const email = local ? localPrint : druckTelePrint
module.exports = {
  ...email
}
