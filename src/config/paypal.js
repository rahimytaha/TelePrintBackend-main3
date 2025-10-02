/** @format */
const sandbox = true

const configOriginal = {
  client_id: "Af4wFhhRkGZE1WZ4F_g49Bw6A1r94Y_o4xlCszm7e6KXMxX_sFefUp1lVS4hdUhelCh-cCvj_VSTwBI4",
  client_secret: "ECY68cc2k8V2rPupDbnTmNhi4Gs4rjqa-a27DH1HA2t2c9Ee81K3JOR93VD6PKoeMYvxeejxqTfF_IPX",
  BasicPayPalUrl: "https://api-m.paypal.com"
}
const configTest = {
  client_id: "AejlTNKKUJdFZoCyqyMzjjX607bK1YbsSFGSAzNcF97C8nFTNSDWTT1H54hjCXEYn5olgb8QtL90x8Bs",
  client_secret: "EHTlCA2By7NKRj3HKdUKHdHOMrtZiJwv5mvXJpCyalPJ1GRyVSGLDQJSHxvAywzcC1TuXd9VvGUi37kB",
  BasicPayPalUrl: "https://www.sandbox.paypal.com"
}

const config = sandbox ? configTest : configOriginal
module.exports = {
  ...config
}
