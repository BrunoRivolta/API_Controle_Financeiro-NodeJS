import express from "express";
import livros from "./livrosRoutes.js";
import autores from "./autoresRoutes.js";

//rotas metodos post get put delete ...
// todos em um arquivo sepadado livrosRoutes, menos o "/" que esta especificado aqi

const routes = (app) => {
    app.route("/").get((req, res) => {
        res.status(200).send({titulo: "API Livraria Talissa"})
    })

    app.use( // chamada do metodo get /livros
        express.json(),
        livros,
        autores,
    )
}

export default routes;