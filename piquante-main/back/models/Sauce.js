const mongoose = require('mongoose') //importation package mongoose


const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: {
        type: Number,
        min: 1,
        max: 5
    },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
module.exports = mongoose.model("Product", productSchema)