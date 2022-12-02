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
      ` CREATE DEFINER = CURRENT_USER TRIGGER ${database}.receitas_AFTER_DELETE AFTER DELETE ON receitas FOR EACH ROW BEGIN` +

      ` SET @ano = YEAR(OLD.data);` +
      ` SET @mes = MONTH(OLD.data);` +
      ` SET @usuario = OLD.usuario_id;` +
      ` SET @somaReceitas = (SELECT sum(valor) FROM ${database}.receitas WHERE YEAR(data) = @ano AND MONTH(data) = @mes);` +
      
      ` IF (@somaReceitas) THEN` +
        ` UPDATE ${database}.relatorios SET receitas = @somaReceitas WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      ` ELSE` +
        ` UPDATE ${database}.relatorios SET receitas = 0 WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      ` END IF;` +
      
      ' END;'
      )
    },
    
    async down (queryInterface, Sequelize) {
      const sequelize = new Sequelize("", username, password, {
        dialect: dialect,
      });

      return sequelize.query(
        `DROP TRIGGER IF EXISTS ${database}.receitas_AFTER_DELETE;`
        );
    },
};

