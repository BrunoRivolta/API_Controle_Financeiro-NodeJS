const database = require('../models')

class RelatorioController {
	static async listaRelatorios(req, res) {
		try {
			const relatorios = await database.Relatorio.findAll() 
			res.status(200).json(relatorios)
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
	static async listaRelatorioPorMesEAno(req, res) {
		const mes = req.params.mes
		const ano = req.params.ano
		try {
			const relatorio = await database.Relatorio.findOne( {where: {mes: mes, ano: ano} })
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