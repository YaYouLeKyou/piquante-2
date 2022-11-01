const multer = require("multer") //appel du pluggin multer

//destination du stockage des images
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, makeFilename(req, file))
  }
})

//création d' un nom de fichier image unique
function makeFilename(req, file) {
  console.log("req, file:", file)
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
  file.fileName = fileName
  return fileName
}
const upload = multer({
  storage
})

module.exports = {
  upload
}