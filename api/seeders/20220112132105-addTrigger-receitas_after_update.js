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
      ` CREATE DEFINER = CURRENT_USER TRIGGER ${database}.receitas_AFTER_UPDATE AFTER UPDATE ON receitas FOR EACH ROW BEGIN` +

      ` SET @ano = YEAR(NEW.data);` +
      ` SET @mes = MONTH(NEW.data);` +
      ` SET @usuario = NEW.usuario_id;` +
      ` SET @mesExiste = (SELECT EXISTS(SELECT mes FROM ${database}.relatorios where mes = @mes));` +
      ` SET @anoExiste = (SELECT EXISTS(SELECT ano FROM ${database}.relatorios where ano = @ano));` +
      ` SET @somaReceitas = (SELECT sum(valor) FROM ${database}.receitas WHERE YEAR(data) = @ano AND MONTH(data) = @mes);` +
      ` SET @usuarioExiste = (SELECT EXISTS(SELECT usuario_id FROM ${database}.relatorios where usuario_id = @usuario));` +
      
      ` IF (@mesExiste = FALSE OR @anoExiste = FALSE OR @usuarioExiste = FALSE) THEN` +
      ` INSERT INTO ${database}.relatorios (mes, ano, receitas, despesas, usuario_id, createdAt, updatedAt) VALUES (@mes, @ano, 0, 0, @usuario, now(), now());` +
      ` END IF;` +
      
      ` UPDATE ${database}.relatorios SET receitas = @somaReceitas WHERE ano = @ano and mes = @mes;` +

      ' END;'
      )
    },
    
    async down (queryInterface, Sequelize) {
      const sequelize = new Sequelize("", username, password, {
        dialect: dialect,
      });

      return sequelize.query(
        `DROP TRIGGER IF EXISTS ${database}.receitas_AFTER_UPDATE;`
        );
    },
};

