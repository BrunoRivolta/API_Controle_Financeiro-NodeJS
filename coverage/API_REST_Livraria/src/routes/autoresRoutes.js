import express from "express";
import AutoresControler from "../controllers/autoresController.js";

// rotas, isso e um CRUD (Create, Read, Update, Delete) 

const router = express.Router();
router
    .get("/autores", AutoresControler.listarAutores)
    .get("/autores/:id", AutoresControler.listarAutoresId)
    .post("/autores", AutoresControler.cadastrarAutor)
    .put("/autores/:id", AutoresControler.atualizarAutor)
    .delete("/autores/:id", AutoresControler.apagarAutor)

export default router;
