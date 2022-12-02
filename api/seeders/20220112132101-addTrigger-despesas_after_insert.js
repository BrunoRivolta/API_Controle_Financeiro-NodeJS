'use strict'

require('dotenv').config()
const process = require('process')
const env = process.env.NODE_ENV

const {database, username, password, dialect} = require(__dirname + '/../config/config.json')[env];

console.log(`Ambiente de desenvolvimento "${env}"`)

module.exports = {
  async up (queryInterface, Sequelize) {
    const sequelize = new Sequelize("", username, password, {
      dialect: dialect,
    });

    return sequelize.query(
      ` CREATE DEFINER = CURRENT_USER TRIGGER ${database}.despesas_AFTER_INSERT AFTER INSERT ON despesas FOR EACH ROW BEGIN` +

      ` SET @categoria = NEW.categoria_id;` +
      ` SET @usuario = NEW.usuario_id;` +
      ` SET @ano = YEAR(NEW.data);` +
      ` SET @mes = MONTH(NEW.data);` +
      ` SET @mesExiste = (SELECT EXISTS(SELECT mes FROM ${database}.relatorios where mes = @mes));` +
      ` SET @anoExiste = (SELECT EXISTS(SELECT ano FROM ${database}.relatorios where ano = @ano));` +
      ` SET @usuarioExiste = (SELECT EXISTS(SELECT usuario_id FROM ${database}.relatorios where usuario_id = @usuario));` +
      ` SET @somaDespesas = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND usuario_id = @usuario);` +
      ` SET @somaCategoria = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND categoria_id = @categoria AND usuario_id = @usuario);` +
      
      ` IF (@mesExiste = FALSE OR @anoExiste = FALSE OR @usuarioExiste = FALSE) THEN` +
        ` INSERT INTO ${database}.relatorios (mes, ano, receitas, despesas, usuario_id, createdAt, updatedAt) VALUES (@mes, @ano, 0, 0, @usuario, now(), now());` +
      ` END IF;` +
      
      ` UPDATE ${database}.relatorios SET despesas = @somaDespesas WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      
      ` CASE` +
        ` WHEN  @categoria = 1 THEN UPDATE ${database}.relatorios SET alimentacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 2 THEN UPDATE ${database}.relatorios SET saude = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 3 THEN UPDATE ${database}.relatorios SET moradia = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 4 THEN UPDATE ${database}.relatorios SET transporte = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 5 THEN UPDATE ${database}.relatorios SET educacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 6 THEN UPDATE ${database}.relatorios SET lazer = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 7 THEN UPDATE ${database}.relatorios SET imprevistos = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` ELSE UPDATE ${database}.relatorios SET outros = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      ` END CASE;` +

      ' END;'
      )
    },
    
    async down (queryInterface, Sequelize) {
      const sequelize = new Sequelize("", username, password, {
        dialect: dialect,
      });

      return sequelize.query(
        `DROP TRIGGER IF EXISTS control_financeiro.despesas_AFTER_INSERT;`
        );
    },
};

