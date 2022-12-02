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
      `ALTER TABLE ${database}.relatorios CHANGE COLUMN saldo saldo FLOAT GENERATED ALWAYS AS (receitas - despesas) STORED ;`
    );
  },
    
  async down (queryInterface, Sequelize) {
    const sequelize = new Sequelize("", username, password, {
      dialect: dialect,
    });

    return sequelize.query(
      `ALTER TABLE ${database}.relatorios CHANGE COLUMN saldo saldo FLOAT NULL DEFAULT NULL ;`
    );
  },
};




  
