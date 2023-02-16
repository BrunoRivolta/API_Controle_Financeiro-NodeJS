import express from "express";
import db from "./config/dbConnect.js"
import routes from "./routes/index.js"

db.on("erro", console.log.bind(console, "Erro de conexão"));
db.once("open", () => {
    console.log("Conexão com o MongoDB feita com sucesso")
});

const app = express(); //chamada do express

app.use(express.json()); // essa linha faz com que os metodos GET POST ... aceitem json
routes(app);

export default app;
