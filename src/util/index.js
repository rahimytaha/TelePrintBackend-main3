/** @format */

const mongoose = require("mongoose")
const config = require("./../config/index")
const fs = require("fs")

const ObjectId = mongoose.Types.ObjectId

const galleryLocations = ["./gallery", "./files", "./blog"]
function setListeners() {
  mongoose.connection.on("connecting", () => console.log("connection log: connecting to mongodb"))
  mongoose.connection.on("connected", () => console.log("connection log: connected to mongodb"))
  mongoose.connection.on("disconnecting", () => console.log("connection log: disconnecting  from mongodb"))
  mongoose.connection.on("disconnected", () => {
    console.log("connection log: disconnected from mongodb")
  })
  mongoose.connection.on("reconnected", () => console.log("connection log: reconnected to mongodb"))
  mongoose.connection.on("error", () => console.log("connection log: error on mongodb"))
}

function mongoConnect() {
  if (config.MONGO_CONNECTION_TYPE === "local") {
    mongoose
      .connect(config.MONGO_CONNECTION_URI_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("connected to Local DB!")
      })
      .catch((err) => {
        console.log(`Error connecting to Local DB:${err.message}`)
      })
  } else {
    mongoose
      .connect(config.MONGO_CONNECTION_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("connected to DB!")
      })
      .catch((err) => {
        console.log(`Error connecting to DB:${err.message}`)
      })
  }
  setListeners()
}

function handleGallery() {
  galleryLocations.map((galleryLocation) => {
    if (fs.existsSync(galleryLocation)) {
      console.log(`The ${galleryLocation} is exist`)
    } else {
      fs.mkdirSync(galleryLocation)
      console.log(`The ${galleryLocation} is created.`)
    }
  })
}

function Initialize() {
  mongoConnect()
  handleGallery()
}
function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}
function makeReferral() {
  var text = ""
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < 8; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

function removeDuplicate(orginalArray, newMember) {
  const newArray = [...orginalArray.map((x) => String(x)), ...newMember.map((x) => String(x))]
  return [...new Set(newArray)]
}
function paginationTools(totalCount = 0, page = 1, limit = 10) {
  try {
    const totalPages = Math.ceil(totalCount / limit)

    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    // Return the paginated results and pagination information
    const returnPageObject = {
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    return returnPageObject
  } catch (error) {
    console.error(error)
  }
}
function SAValidator(req) {
  let { count, width, height } = req.body
  count = parseInt(count)
  width = parseInt(width)
  height = parseInt(height)
  const SAResult = (count * width * height) / 124740

  if (SAResult >= 5000) {
    return { hasError: true }
  }
  return { hasError: false }
}
function isValidObjectId(id) {
  return ObjectId.isValid(id)
}

module.exports = {
  mongoConnect,
  handleGallery,
  shuffle,
  makeReferral,
  Initialize,
  removeDuplicate,
  paginationTools,
  SAValidator,
  isValidObjectId
}
