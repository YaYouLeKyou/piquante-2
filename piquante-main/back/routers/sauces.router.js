const express = require("express") //importation du module router Express
const {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce
} = require("../controllers/sauces") //Chemin user dans controllers
const {
  authenticateUser
} = require("../middleware/auth")
const {
  upload
} = require("../middleware/multer") //Définition des chemins sauces, authorisation et multer qui servirons pour le router
const saucesRouter = express.Router()
const bodyParser = require("body-parser")

saucesRouter.use(bodyParser.json())
saucesRouter.use(authenticateUser)

saucesRouter.get("/", getSauces)
saucesRouter.post("/", upload.single("image"), createSauce)
saucesRouter.get("/:id", getSauceById)
saucesRouter.delete("/:id", deleteSauce)
saucesRouter.put("/:id", upload.single("image"), modifySauce)
saucesRouter.post("/:id/like", likeSauce) //chaque router a son CRUD (Get, Post, Put, Delete) avec son chemin et ses droits

module.exports = {
  saucesRouter
}