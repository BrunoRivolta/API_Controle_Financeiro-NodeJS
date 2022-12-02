const database = require('../models')

class RelatorioController {
	static async listaRelatorios(req, res) {
		const id = req.user.id
		try {
			const relatorios = await database.Relatorio.findAll({ where: { usuario_id: Number(id) } }) 
			res.status(200).json(relatorios)
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async listaRelatorioPorMesEAno(req, res) {
		const id = req.user.id
		const mes = req.params.mes
		const ano = req.params.ano
		try {
			const relatorio = await database.Relatorio.findOne( {where: {mes: mes, ano: ano, usuario_id: Number(id)} })
			if (relatorio === null) {
				res.status(200).json({message: `Relatório não existente para ${mes}/${ano}`})
			} else {
				res.status(200).json(relatorio)
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
}

module.exports = RelatorioController