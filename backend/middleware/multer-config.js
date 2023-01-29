const multer = require("multer");      // package pour faciliter la gestion de fichiers envoyés vers l'API

const MIME_TYPES = {    // dictionnaire de traduction
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
}

const storage = multer.diskStorage({    // objet de configuration pour multer, diskStorage pour dire qu'on va l'enregistrer sur le disque
    destination: (req, file, callback) => {     // fonction qui va expliquer à multer dans quel dossier enregistrer les fichiers
        callback(null, "images")    // premier argument null pour dire qu'il n'y a pas eu d'erreur, nom du dossier en 2ème argument
    },
    filename: (req, file, callback) => {    // explique à multer quel nom de fichier utilisé, on ne peut pas utiliser le nom de fichier d'origine sinon il risque d'y avoir des pb lorsque deux fichiers ont le même nom
        let name = file.originalname;       // on prend le nom original du fichier
        name = name.substring(0, name.length - 4);     // on enlève les 4 derniers caractères donc l'extension
        name = name.split(" ").join("_");    // on génère le nouveau nom du fichier, on remplace les espaces (qui peuvent poser des pb côté server) du nom original par des _
        const extension = MIME_TYPES[file.mimetype];        // on n'a pas accès à l'extension du fichier envoyé mais on a accès à son mime type
        callback(null, name + Date.now() + "." + extension);    // on crée le filename entier, timestamp pour rendre le nom le plus unique possible (à la ms près)
    }
});

module.exports = multer({storage: storage}).single("image");     // exporter le middleware multer configuré, méthode single pour dire qu'il s'agit d'un fichier unique et d'un fichier image uniquement