import mongoose from "mongoose";

//configuração do mongoDB

mongoose.connect("mongodb+srv://brrivolta:br260800@cluster0.c9swxgg.mongodb.net/livraria_node");

let db = mongoose.connection;

export default db;

