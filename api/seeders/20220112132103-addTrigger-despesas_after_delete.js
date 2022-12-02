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
      ` CREATE DEFINER = CURRENT_USER TRIGGER ${database}.despesas_AFTER_DELETE AFTER DELETE ON despesas FOR EACH ROW BEGIN` +

      ` SET @usuario = OLD.usuario_id;` +
      ` SET @categoria = OLD.categoria_id;` +
      ` SET @ano = YEAR(OLD.data);` +
      ` SET @mes = MONTH(OLD.data);` +
      ` SET @somaDespesas = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND usuario_id = @usuario);` +
      ` SET @somaCategoria = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND categoria_id = @categoria AND usuario_id = @usuario);` +
      
      ` IF (@somaDespesas) THEN` +
        ` UPDATE ${database}.relatorios SET despesas = @somaDespesas WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      ` ELSE` +
        ` UPDATE ${database}.relatorios SET despesas = '0' WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      ` END IF;` +
      
      ` CASE` +
        ` WHEN  @categoria = 1 THEN UPDATE ${database}.relatorios SET alimentacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 2 THEN UPDATE ${database}.relatorios SET saude = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 3 THEN UPDATE ${database}.relatorios SET moradia = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 4 THEN UPDATE ${database}.relatorios SET transporte = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 5 THEN UPDATE ${database}.relatorios SET educacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 6 THEN UPDATE ${database}.relatorios SET lazer = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 7 THEN UPDATE ${database}.relatorios SET imprevistos = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario; ` +
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
        `DROP TRIGGER IF EXISTS ${database}.despesas_AFTER_DELETE;`
        );
    },
};

