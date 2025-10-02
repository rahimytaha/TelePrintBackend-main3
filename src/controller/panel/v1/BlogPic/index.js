/** @format */

const BaseController = require("../../../BaseController")
const fs = require("fs")
const path = require("path")
const routerFolder = "blog"
const folderPath = path.join(__dirname, "../../../../../blog")
const { BASE_URL_FOR_MULTER } = require("../../../../config")

module.exports = new (class BlogPostController extends BaseController {
  async create(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          data: {},
          message: "لطفا یک فایل را انتخاب کنید."
        })
      }
      const object = {
        url: req.file ? BASE_URL_FOR_MULTER + "/gallery/" + req.file.filename : "",
        name: req.file ? req.file.filename : "",
        createdAt: new Date()
      }

      return res.status(201).json({
        data: object,
        message: "شیوه ارسال ثبت شد."
      })
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getAll(req, res) {
    try {
      const files = fs.readdirSync(folderPath)

      const filesWithStats = files.map((file) => {
        const fullPath = path.join(folderPath, file)
        const stats = fs.statSync(fullPath)
        return {
          url: BASE_URL_FOR_MULTER + "/" + routerFolder + "/" + file,
          name: file,
          createdAt: stats.birthtime || stats.ctime
        }
      })

      filesWithStats.sort((a, b) => b.createdAt - a.createdAt)

      if (filesWithStats && filesWithStats.length) {
        return res.status(200).json({
          data: filesWithStats
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "شیوه ارسالی ثبت نشده است."
        })
      }
    } catch (err) {
      console.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async deletePic(req, res) {
    try {
      const filename = req.body.name
      if (!filename) {
        return res.status(400).json({ message: "Dateiname nicht angegeben." })
      }

      const filePath = path.join(folderPath, filename)

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Datei nicht gefunden." })
      }

      await fs.promises.unlink(filePath)

      return res.status(200).json({ message: "Datei erfolgreich gelöscht." })
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()
