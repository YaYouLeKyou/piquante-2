const {
    createUser,
    logUser
} = require("../controllers/users") //création du chemin user dans controllers

const express = require("express") //importation du module router express
const authRouter = express.Router()

authRouter.post("/signup", createUser) //les routers signup et login sont en methode post
authRouter.post("/login", logUser)

module.exports = {
    authRouter
} // export du module