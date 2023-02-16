import mongoose from "mongoose";

//este esquema mostra o padrão para salvar arquivos no DB todos os campos e se é um campo obrigatorio ou nao

const livroSchema = new mongoose.Schema(
    {
    id: {type: String},
    titulo: {type: String, require: true},
    autor: {type: mongoose.Schema.Types.ObjectId, ref: "autores", requires: true}, // faz referencia ao cadastro de atores.
    editora: {type: String, require: true},
    paginas: {type: Number},
    imagem: {type: String, require: true}
    }
);

const livros = mongoose.model("livros", livroSchema);

export default livros;