const database = require('../models')

class ReceitasController {

	static async listaReceitas(req, res) {
		const userId = req.user.id
		const paramBusca = req.query.busca
		const resultadoBusca = []
		try {
			const receitas = await database.Receitas.findAll({ where: { usuario_id: Number(userId) } })
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

	static async listaReceitasPorMesEAno(req, res) {
		const userId = req.user.id
		const mes = req.params.mes
		const ano = req.params.ano
		const data = `${ano}-${mes}`
		const resultadoReceitas = []
		try {
			const receitas = await database.Receitas.findAll({ where: { usuario_id: Number(userId) } })
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
		const dadosNovaReceita = req.body
		dadosNovaReceita.usuario_id = req.user.id
		try{
			const receita = await database.Receitas.create(dadosNovaReceita)
			res.status(200).json(receita)
		} catch(err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async atualizaReceita(req, res) {
		const { id } = req.params
		const userId = req.user.id
		const atualizacao = req.body
		try{
			await database.Receitas.update(atualizacao, { where: { id: Number(id), usuario_id: Number(userId) } })
			return res.status(200).json({ message: 'Receita atualizada' })
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}

	static async apagaReceita(req, res) {  
		const { id } = req.params
		const userId = req.user.id
		try {
			await database.Receitas.destroy( {where: { id: Number(id), usuario_id: Number(userId) } })
			return res.status(200).json({ message: 'Receita deletada' })
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
}


module.exports = ReceitasController