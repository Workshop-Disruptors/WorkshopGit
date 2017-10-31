// Récuperation des librairies de bases permettant de faire un serveur d'API
var express = require ("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose")

// Parametres du serveur
var hostname = "localhost";
var port = 3000;

// Ces options sont recommandées par mLab pour une connexion à la base
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

// Adresse de la base de données
var urlmongo = "mongodb://test-user:test-password@ds133044.mlab.com:33044/disruptors"; 

// Copnnexion de l'API à la base de données
mongoose.connect(urlmongo, options, function(err) {
	if(err){
console.log("Erreur lors de la connexion à la base de données")
} else { console.log("Connexion à la base de données réussie")}
});

// Création d'un objet de type "express"
var app = express();

// Integration de bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Definiton de notre schéma de données
var medecinSchema = mongoose.Schema({
	nom: String,
	ville: String,
	tel: String,
	description: String
});

var Medecin = mongoose.model("Medecin",medecinSchema);


// Creation d'un Router pour faciliter le routage
var router = express.Router();

// Implementation pour la route /medecin
router.route("/medecin")
.get(function(req,res){
	Medecin.find(function(err, medecins){
        if (err){
            res.send(err); 
        }
        res.json(medecins); 
        
	})
})
.post(function(req,res){
	// Ajout d'un medecin suivant le model definit plus haut
	var medecin = new Medecin();

	medecin.nom = req.body.nom;
	medecin.ville = req.body.ville;
	medecin.tel = req.body.tel;
	medecin.description =req.body.description;

	// Enregistrement du medecin dans la base de données
	medecin.save(function(err){
		if(err){
			res.send(err);
		}
		else {
			res.send("Vous venez d'ajouter un médecin à Tempore")};	})
});

//Implementation pour un medecin specifique dans /medecin
router.route("/medecin/:idMedecin")
.get(function(req,res){
	res.send("Vous acceder aux information du medecin "+req.params.idMedecin);
})
.put(function(req,res){
	res.send("Vous souhaitez modifier les informations du medecin "+req.params.idMedecin);
})
.get(function(req,res){
	res.send("Vous souhaitez supprimer de la liste le medecin "+req.params.idMedecin);
});

// Implementation à la racine
router.route("/")
.all(function(req,res){
	res.send("Bienvenue sur Tempore");
});

// Initialisation du serveur avec le routage
app.use(router);

//Demarage du serveur
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+hostname+":"+port+"\n");
});
