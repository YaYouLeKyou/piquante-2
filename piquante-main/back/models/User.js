const mongoose = require("mongoose") //importation package mongoose et unique validator
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true //gràce a unique validator la base de donné refusera 2 signup avec le même email
    },
    password: {
        type: String,
        required: true
    }
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)