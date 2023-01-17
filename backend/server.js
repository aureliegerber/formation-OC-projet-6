const http = require("http");   // importer le package http de Node
const app = require("./app");   // importer l'application

function normalizePort (val) {
    const port = parseInt(val, 10); // convertir la chaine de caractères val en nombre en base 10
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);  // dire à l'application express sur quel port elle doit tourner

function errorHandler (error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();   // { address: '::', family: 'IPv6', port: 3000 }
    const bind = typeof address === "string" ? "pipe " + address : "port:" + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + "requires elevated privilieges.");
            process.exit(1);
        case "EADDRINUSE":
            console.error(bind + "is already in use.");
            process.exit(1);
        default:
            throw error;
    }
};

const server = http.createServer(app);  // créer un server, cette méthode prend pour argument la fonction qui sera appelée à chaque requête reçue par le server

server.on("error", errorHandler);
server.on("listening", function() {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port:" + port;
    console.log("Listening on " + bind);    
});

server.listen(port); // configurer le server pour qu'il écoute soit la variable d'environnement du port, soit le port 3000