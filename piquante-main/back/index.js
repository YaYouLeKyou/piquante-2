const {
    app,
    express
} = require("./server")
const {
    saucesRouter
} = require("./routers/sauces.router")
const {
    authRouter
} = require("./routers/auth.router")
const port = 3000
const path = require("path")
//le chemin que vous fournissez à la fonction express.static est relatif au répertoire 
//à partir duquel vous lancez votre processus de nœud. 
//Si vous exécutez l'application express à partir d'un autre répertoire, 
//il est plus sûr d'utiliser le chemin absolu du répertoire que vous souhaitez servir gràce a path

const bodyParser = require("body-parser")
//Afin de lire les données HTTP POST, 
//nous devons utiliser le module node "body-parser". 
//body-parser est un morceau de middleware express qui lit l'entrée d'un formulaire 
//et le stocke en tant qu'objet javascript accessible par l'intermédiaire de req.body

const cors = require("cors") // CORS permet de prendre en charge des requêtes multi-origines sécurisées 
//et des transferts de données entre des navigateurs et des serveurs web

// Connection to database
require("./mongo")

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use("/api/sauces", saucesRouter) //gestion des principaux chemin de l' API
app.use("/api/auth", authRouter)

//Routes
app.get("/", (req, res) => res.send("Hello World!"))

// Listen
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Listening on port " + port))