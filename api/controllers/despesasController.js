const database = require('../models')


class DespesasController {
	static async listaDespesas(req, res) {
		const userId = req.user.id
		const paramBusca = req.query.busca
		const resultadoBusca = []
		try {
			const despesas = await database.Despesas.findAll({ where: { usuario_id: Number(userId) } })
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

	static async listaDespesasPorMesEAno(req, res) {
		const userId = req.user.id
		const mes = req.params.mes
		const ano = req.params.ano
		const data = `${ano}-${mes}`
		const resultadoDespesas = []
		try {
			const despesas = await database.Despesas.findAll({ where: { usuario_id: Number(userId) } })
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
		const userId = req.user.id
		const dadosNovaDespesa = req.body
		dadosNovaDespesa.usuario_id = userId
		
		if (dadosNovaDespesa.categoria_id > 8 || dadosNovaDespesa.categoria_id < 1 || dadosNovaDespesa.categoria_id === null) {
			dadosNovaDespesa.categoria_id = 8
		}

		try{
			const despesa = await database.Despesas.create(dadosNovaDespesa)
			res.status(200).json(despesa)
		} catch(err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async atualizaDespesa(req, res) {
		const userId = req.user.id
		const { id } = req.params
		const atualizacao = req.body
		try{
			await database.Despesas.update(atualizacao, { where: { id: Number(id), usuario_id: Number(userId) } })
			return res.status(200).json({ message: 'Despesa Atualizada'})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}

	static async apagaDespesa(req, res) {  
		const { id } = req.params
		const userId = req.user.id
		try {
			await database.Despesas.destroy( {where: { id: Number(id), usuario_id: Number(userId) } })
			return res.status(200).json({ message: 'Despesa apagada' })
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
}

module.exports = DespesasController

