const Product = require('../models/sauce')
const {
  unlink
} = require("fs/promises")

//Appel de toutes les sauces avec request, result
function getSauces(req, res) {
  Product.find({}) //demande a la base de données les sauces avec find()
    .then((products) => res.send(products)) //utilisation de then si le retour est ok
    .catch((error) => res.status(500).send(error))
  //et catch si cela ne fonctionne pas, on renvois l' erreur et un statut ici 500
  //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes => tous les codes errors status
}

function getSauce(req, res) {
  const {
    id
  } = req.params
  return Product.findById(id)
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
  //on récupère l' id des params
  const {
    id
  } = req.params
  Product.findByIdAndDelete(id) //methode mongoose pour delete un id
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => res.status(500).send({
      message: err
    }))
}

function modifySauce(req, res) {

  const hasNewImage = req.file != null //on regarde si il y a un req.file, si oui il y a une image
  const payload = makePayload(hasNewImage, req) //on fabrique un payload

  //methode mongoose trouver l' id et mettre a jour
  Product.findByIdAndUpdate({
      _id: req.params.id
    }, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => console.error("PROBLEM UPDATING", err))
}

function makePayload(hasNewImage, req) {
  console.log("hasNewImage:", hasNewImage)
  //si il n' y a pas de nouvelle image
  if (!hasNewImage) return req.body //la fonction s' arrète
  //sinon
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  console.log("NOUVELLE IMAGE A GERER")
  console.log("voici le payload:", payload)
  return payload
}

//Les images doivent être traité differamment, 
//comme pour une url, il faut définir le chemin avec le protocole(http)
//hote (localhost) et le nom du fichier (filename)
function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}
//utilisation de split a -1

function deleteImage(product) {
  if (product == null) return
  console.log("DELETE IMAGE", product)
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/" + imageToDelete)
}


function sendClientResponse(product, res) {
  if (product == null) {
    console.log("NOTHING TO UPDATE")
    return res.status(404).send({
      message: "Object not found in database"
    })
  }
  console.log("ALL GOOD, UPDATING:", product)
  return Promise.resolve(res.status(200).send(product)).then(() => product)
  //retourne une promesse résolu et envpois le product
}



function createSauce(req, res) {
  const {
    body,
    file
  } = req
  const {
    fileName
  } = file
  const sauce = JSON.parse(body.sauce)
  const {
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
    userId
  } = sauce

  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  product
    .save()
    .then((message) => res.status(201).send({
      message
    }))
    .catch((err) => res.status(500).send(err))
}

// Création like ou dislike (Post/:id/like)
function likeSauce(req, res, next) {
  // Si l'utilisateur aime la sauce
  if (req.body.like === 1) {
    // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
    Product.updateOne({
        _id: req.params.id
      }, {
        $inc: {
          likes: req.body.like++
        },
        $push: {
          usersLiked: req.body.userId
        }
      })
      .then((sauce) => res.status(200).json({
        message: 'Like ajouté !'
      }))
      .catch(error => res.status(400).json({
        error
      }));
  } else if (req.body.like === -1) {
    // Si l'utilisateur n'aime pas la sauce
    // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
    Product.updateOne({
        _id: req.params.id
      }, {
        $inc: {
          dislikes: (req.body.like++) * -1
        },
        $push: {
          usersDisliked: req.body.userId
        }
      })
      .then((sauce) => res.status(200).json({
        message: 'Dislike ajouté !'
      }))
      .catch(error => res.status(400).json({
        error
      }));
  } else {
    // Si like === 0 l'utilisateur supprime son vote
    Product.findOne({
        _id: req.params.id
      })
      .then(sauce => {
        // Si le tableau "userLiked" contient l'ID de l'utilisateur
        if (sauce.usersLiked.includes(req.body.userId)) {
          // On enlève un like du tableau "userLiked" 
          Product.updateOne({
              _id: req.params.id
            }, {
              $pull: {
                usersLiked: req.body.userId
              },
              $inc: {
                likes: -1
              }
            })
            .then((sauce) => {
              res.status(200).json({
                message: 'Like supprimé !'
              })
            })
            .catch(error => res.status(400).json({
              error
            }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          // Si le tableau "userDisliked" contient l'ID de l'utilisateur
          // On enlève un dislike du tableau "userDisliked" 
          Product.updateOne({
              _id: req.params.id
            }, {
              $pull: {
                usersDisliked: req.body.userId
              },
              $inc: {
                dislikes: -1
              }
            })
            .then((sauce) => {
              res.status(200).json({
                message: 'Dislike supprimé !'
              })
            })
            .catch(error => res.status(400).json({
              error
            }))
        }
      })
      .catch(error => res.status(400).json({
        error
      }));
  }
};

module.exports = {
  sendClientResponse,
  getSauce,
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce
}