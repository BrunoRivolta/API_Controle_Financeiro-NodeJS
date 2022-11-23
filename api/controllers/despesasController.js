const database = require('../models')

class DespesasController {
	static async listaDespesas(req, res) {
		const paramBusca = req.query.busca
		const resultadoBusca = []
		try {
			const despesas = await database.Despesas.findAll()
			if (paramBusca === undefined) {
				res.status(200).json(despesas) 
			} else {
				for (let i = 0; i < despesas.length; i++) {
					const despesaAtual = (despesas[i].descricao).toLowerCase()
					if(despesaAtual.match(paramBusca.toLowerCase()) != null) {
						resultadoBusca.push(despesas[i])
					}}
				if(resultadoBusca.length > 0)  {
					res.status(200).json(resultadoBusca)  
				} else {
					res.status(204).json({'Busca': `Não foi encontrado resutado para: ${paramBusca}`})
				}
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async listaDespesaPorId(req, res) {
		const { id } = req.params
		try {
			const despesa = await database.Despesas.findOne({ where: { id: Number(id) } })
			if (despesa != null) {
				res.status(200).json(despesa)
			} else {
				res.status(200).json({ message: `O id ${id}, não existe` })
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async listaDespesasPorMesEAno(req, res) {
		const mes = req.params.mes
		const ano = req.params.ano
		const data = `${ano}-${mes}`
		const resultadoDespesas = []
		try {
			const despesas = await database.Despesas.findAll()
			for (let i = 0; i < despesas.length; i++) {
				let dataAtual = (JSON.stringify(despesas[i].data)).slice(1,8)
				if (dataAtual === data) {
					resultadoDespesas.push(despesas[i])
				} 
			}
			if(resultadoDespesas.length > 0)  {
				res.status(200).json(resultadoDespesas)  
			} else {
				res.status(200).json({ Busca: `Não foi encontrado resutado para: ${mes}/${ano}` })
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async adicionarDespesa(req, res) {
		try{
			const dadosNovaDespesa = req.body
			const novaDespesa = await database.Despesas.create(dadosNovaDespesa)
			res.status(200).json(novaDespesa)
		} catch(err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async atualizaDespesa(req, res) {
		const { id } = req.params
		const atualizacao = req.body
		try{
			await database.Despesas.update(atualizacao, { where: { id: Number(id) } })
			return res.status(200).json({ message: `A despesa ID: ${id}, foi atualizada`})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
	static async restauraDespesa(req, res) {
		const { id } = req.params
		try {
			await database.Despesas.restore({ where: { id: Number(id) } })
			return res.status(200).json({message: `A despesa id: ${id} foi restaurada com sucesso!`})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
	static async apagaDespesa(req, res) {  
		const { id } = req.params
		try {
			await database.Despesas.destroy( {where: { id: Number(id) } })
			return res.status(200).json({ message: `id ${id} deletado` })
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
}

module.exports = DespesasController

