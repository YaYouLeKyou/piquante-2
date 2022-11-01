const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")



const password = process.env.DB_PASSWORD
const username = process.env.DB_USER

const uri = `mongodb+srv://${username}:${password}@cluster0.fqyz4.mongodb.net/?retryWrites=true&w=majority`

mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo: ", err))



module.exports = {
  mongoose
}