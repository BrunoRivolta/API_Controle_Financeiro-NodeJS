/* eslint-disable */
'use strict'
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.query(
			" DROP TRIGGER IF EXISTS `control_financeiro`.`despesas_AFTER_INSERT`; "

			" DELIMITER $$ "
			" USE `control_financeiro`$$ "
			" CREATE DEFINER=`root`@`localhost` TRIGGER `despesas_AFTER_INSERT` AFTER INSERT ON `despesas` FOR EACH ROW BEGIN "
			
			" SET @categoria = NEW.categoria_id; "
			" SET @usuario = NEW.usuario_id; "
			" SET @ano = YEAR(NEW.data); "
			" SET @mes = MONTH(NEW.data); "
			" SET @mesExiste = (SELECT EXISTS(SELECT mes FROM control_financeiro.relatorios where mes = @mes)); "
			" SET @anoExiste = (SELECT EXISTS(SELECT ano FROM control_financeiro.relatorios where ano = @ano)); "
			" SET @usuarioExiste = (SELECT EXISTS(SELECT usuario_id FROM control_financeiro.relatorios where usuario_id = @usuario)); "
			" SET @somaDespesas = (SELECT sum(valor) FROM control_financeiro.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND usuario_id = @usuario); "
			" SET @somaCategoria = (SELECT sum(valor) FROM control_financeiro.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND categoria_id = @categoria AND usuario_id = @usuario); "
			
			" IF (@mesExiste = FALSE OR @anoExiste = FALSE OR @usuarioExiste = FALSE) THEN " 
				" INSERT INTO control_financeiro.relatorios (mes, ano, receitas, despesas, usuario_id, createdAt, updatedAt) VALUES (@mes, @ano, 0, 0, @usuario, now(), now()); "
			" END IF; "
			
			" UPDATE control_financeiro.relatorios SET despesas = @somaDespesas WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
			
			" CASE "
				" WHEN  @categoria = 1 THEN UPDATE control_financeiro.relatorios SET alimentacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" WHEN  @categoria = 2 THEN UPDATE control_financeiro.relatorios SET saude = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" WHEN  @categoria = 3 THEN UPDATE control_financeiro.relatorios SET moradia = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" WHEN  @categoria = 4 THEN UPDATE control_financeiro.relatorios SET transporte = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" WHEN  @categoria = 5 THEN UPDATE control_financeiro.relatorios SET educacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" WHEN  @categoria = 6 THEN UPDATE control_financeiro.relatorios SET lazer = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" WHEN  @categoria = 7 THEN UPDATE control_financeiro.relatorios SET imprevistos = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
				" ELSE UPDATE control_financeiro.relatorios SET outros = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; "
			" END CASE; "
			
			" END$$ "
			" DELIMITER ; "
		)
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.query()
	}
}

