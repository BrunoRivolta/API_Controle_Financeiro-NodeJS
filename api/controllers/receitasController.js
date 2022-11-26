const database = require('../models')

class ReceitasController {
	static async listaReceitas(req, res) {
		const paramBusca = req.query.busca
		const resultadoBusca = []
		try {
			const receitas = await database.Receitas.findAll()
			if (paramBusca === undefined) {
				res.status(200).json(receitas) 
			} else {
				for (let i = 0; i < receitas.length; i++) {
					const receitaAtual = (receitas[i].descricao).toLowerCase()
					if(receitaAtual.match(paramBusca.toLowerCase()) != null) {
						resultadoBusca.push(receitas[i])
					}}
				if(resultadoBusca.length > 0)  {
					res.status(200).json(resultadoBusca)  
				} else {
					res.status(204).json({Busca: `Não foi encontrado resutado para: ${paramBusca}`})
				}
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async listaReceitaPorId(req, res) {
		const { id } = req.params
		try {
			const receita = await database.Receitas.findOne( { where: {id: Number(id)}})
			if (receita != null) {
				res.status(200).json(receita)
			} else {
				res.status(200).json( {message: `O id ${id}, não existe`} )
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async listaReceitasPorMesEAno(req, res) {
		const mes = req.params.mes
		const ano = req.params.ano
		const data = `${ano}-${mes}`
		const resultadoReceitas = []
		try {
			const receitas = await database.Receitas.findAll()
			for (let i = 0; i < receitas.length; i++) {
				let dataAtual = (JSON.stringify(receitas[i].data)).slice(1,8)
				if (dataAtual === data) {
					resultadoReceitas.push(receitas[i])
				} 
			}
			if(resultadoReceitas.length > 0)  {
				res.status(200).json(resultadoReceitas)  
			} else {
				res.status(200).json({Busca: `Não foi encontrado resutado para: ${mes}/${ano}`})
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async adicionarReceita(req, res) {
		try{
			const dadosNovaReceita = req.body
			const novaReceita = await database.Receitas.create(dadosNovaReceita)
			res.status(200).json(novaReceita)
		} catch(err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async atualizaReceita(req, res) {
		const { id } = req.params
		const atualizacao = req.body
		try{
			await database.Receitas.update(atualizacao, { where: { id: Number(id) } })
			return res.status(200).json({ message: `A despesa ID: ${id}, foi atualizada`})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
	static async restauraReceita(req, res) {
		const { id } = req.params
		try {
			await database.Receitas.restore({ where: { id: Number(id) } })
			return res.status(200).json({message: `A receita id: ${id} foi restaurada com sucesso!`})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
	static async apagaReceita(req, res) {  
		const { id } = req.params
		try {
			await database.Receitas.destroy( {where: { id: Number(id) } })
			return res.status(200).json({ message: `id ${id} deletado` })
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
}


module.exports = ReceitasController