/** @format */

const multer = require("multer")
const fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./gallery"
    fs.access(dir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`Directory access issue: ${err.message}`)
        return cb(new Error("Error: Cannot write to files directory"))
      }
      cb(null, dir)
    })
  },
  filename: function (req, file, cb) {
    const [...splitedFileName] = file.originalname.split(".")
    const Suffix = splitedFileName[splitedFileName.length - 1]
    console.log(file)
    cb(null, "file" + Date.now() + "." + Suffix)
  }
})

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./files"
    fs.access(dir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`Directory access issue: ${err.message}`)
        return cb(new Error("Error: Cannot write to files directory"))
      }
      cb(null, dir)
    })
  },
  filename: function (req, file, cb) {
    const [...splitedFileName] = file.originalname.split(".")
    const Suffix = splitedFileName[splitedFileName.length - 1]
    cb(null, "file" + Date.now() + "." + Suffix)
  }
})

const storageBlog = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./blog"
    fs.access(dir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`Directory access issue: ${err.message}`)
        return cb(new Error("Error: Cannot write to files directory"))
      }
      cb(null, dir)
    })
  },
  filename: function (req, file, cb) {
    const [...splitedFileName] = file.originalname.split(".")
    const Suffix = splitedFileName[splitedFileName.length - 1]
    cb(null, "blog" + Date.now() + "." + Suffix)
  }
})
const upload = multer({ storage: storage })
const uploadFile = multer({ storage: storageFile })
const uploadBlog = multer({ storage: storageBlog })
module.exports = { upload: upload, uploadFile: uploadFile, uploadBlog: uploadBlog }
