import livros from "../models/livro.js";

class LivrosControler {
    
    static listarLivros = (req, res) => {
        livros.find()
            .populate('autor') // o populate pega a referencia do autor
            .populate('editora')
            .exec((err, livros) => {
        res.status(200).json(livros);
        })
    }

    static listarLivroId = (req, res) => {
        const id = req.params.id;
        livros.findById(id)
            .populate("autor", "nome") //vai mostrar so o nome do autor
            .populate("editora")
            .exec((err, livro) => {
            if(err) {
                res.status(400).send({message: `${err.message} - ID do livro nao localizado`})
            } else {
                res.status(200).send(livro);
            }
        })
    }
    static cadastrarLivro = (req, res) => {
        let livro = new livros(req.body);
        livro.save((err) => {
            if(err) {
                res.status(500).send({message: `${err.message} - Falha ao cadastrar livro`})
            } else {
                res.status(201).send(livro.toJSON())
            }
        })
    }
    static atualizarLivro = (req, res) => {
        const id = req.params.id;
        livros.findByIdAndUpdate(id, {$set: req.body}, (err) => {
            if(!err) {
                res.status(200).send({message: "Livro atualizado com Sucesso"})
            } else {
                res.status(500).send({message: err.message})
            }
        })
    }
    static apagarLivro = (req, res) => {
        const id = req.params.id;
        livros.findByIdAndDelete(id, (err) => {
            if(err) {
                res.status(500).send({message: err.message})
            } else {
                res.status(200).send({message: `Livro ID = "${id}" removido com Sucesso`})
            }
        })

    }
    static listarLivrosEditora = (req, res) => {
        const editora = req.query.editora;
        livros.find({ "editora": editora }, {}, (err, livros) => {
            res.status(200).send(livros);
        })
    }
}

export default LivrosControler;
