import autores from "../models/autor.js";

class AutoresController {
    static listarAutores = (req, res) => {
        autores.find((err, autores) => {
        res.status(200).json(autores);
    })
    }

    static listarAutoresId = (req, res) => {
        const id = req.params.id;
        autores.findById(id, (err, livro) => {
            if(err) {
                res.status(400).send({message: `${err.message} - ID do autor nao localizado`})
            } else {
                res.status(200).send(livro);
            }
        })
    }
    static cadastrarAutor = (req, res) => {
        let autor = new autores(req.body);
        autor.save((err) => {
            if(err) {
                res.status(500).send({message: `${err.message} - Falha ao cadastrar autor`})
            } else {
                res.status(201).send(autor.toJSON())
            }
        })
    }
    static atualizarAutor = (req, res) => {
        const id = req.params.id;
        autores.findByIdAndUpdate(id, {$set: req.body}, (err) => {
            if(!err) {
                res.status(200).send({message: "Autor atualizado com Sucesso"})
            } else {
                res.status(500).send({message: err.message})
            }
        })
    }
    static apagarAutor = (req, res) => {
        const id = req.params.id;
        autores.findByIdAndDelete(id, (err) => {
            if(err) {
                res.status(500).send({message: err.message})
            } else {
                res.status(200).send({message: `Autor ID = "${id}" removido com Sucesso`})
            }
        })

    }
}

export default AutoresController;
