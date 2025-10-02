/** @format */

const express = require("express")
const cors = require("cors")
const config = require("./src/config/index")
const util = require("./src/util/index")
const Routes = require("./src/routes/index")
const app = express()
const path = require("path")

util.mongoConnect()
util.handleGallery()
app.use(cors())

app.use(express.json({ type: "application/json" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("gallery"))
app.use(express.static("blog"))
app.use(express.static("staticGallery"))
app.use(express.static("files"))

app.get("/pay/success", function (req, res) {
  res.sendFile(path.join(__dirname + "/src/thirdPartyAPI/IDPay/back/succsMobile.html"))
})
app.get("/pay/failed ", function (req, res) {
  res.sendFile(path.join(__dirname + "/src/thirdPartyAPI/IDPay/back/failMobile.html"))
})

app.get("/gallery/:fileName", (req, res) => {
  res.sendFile(`./gallery/${req.params.fileName}`, {
    root: path.join(__dirname, "")
  })
})
app.get("/blog/:fileName", (req, res) => {
  res.sendFile(`./blog/${req.params.fileName}`, {
    root: path.join(__dirname, "")
  })
})
app.get("/static/:fileName", (req, res) => {
  res.sendFile(`./staticGallery/${req.params.fileName}`, {
    root: path.join(__dirname, "")
  })
})

app.get("/files/:fileName", (req, res) => {
  res.sendFile(`./files/${req.params.fileName}`, {
    root: path.join(__dirname, "")
  })
})
app.use("/", Routes)










const multer = require('multer');


const upload = multer({ storage: multer.memoryStorage() });

const nextcloudUrl = 'https://cloud.teleprint.at/remote.php/dav/files/storageshare/Teleprint/Customers/';
const username = 'storageshare';
const password = '$SPyOME~PHdB8WM~';

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded');

  try {
    const response = await fetch(`${nextcloudUrl}${file.originalname}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
      },
      body: file.buffer,
    });

    if (response.ok) {
      const shareUrl = `https://cloud.teleprint.at/s/xyz123`; 
      res.send(`File uploaded! Share link: ${shareUrl}`);
    } else {
      res.status(500).send('Upload failed');
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('Error: ' + error.message);
  }
});






app.listen(config.PORT, () => console.log(`Teleprint listening at http://localhost:${config.PORT}`))
