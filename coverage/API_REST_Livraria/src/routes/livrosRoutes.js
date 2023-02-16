import express from "express";
import LivrosControler from "../controllers/livrosController.js";

// rotas, isso e um CRUD (Create, Read, Update, Delete) 

const router = express.Router();
router
    .get("/livros", LivrosControler.listarLivros)
    .get("/livros/busca", LivrosControler.listarLivrosEditora)
    .get("/livros/:id", LivrosControler.listarLivroId)
    .post("/livros", LivrosControler.cadastrarLivro)
    .put("/livros/:id", LivrosControler.atualizarLivro)
    .delete("/livros/:id", LivrosControler.apagarLivro)

export default router;
