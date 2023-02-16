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
      ` CREATE DEFINER = CURRENT_USER TRIGGER ${database}.despesas_AFTER_UPDATE AFTER UPDATE ON despesas FOR EACH ROW BEGIN` +

      ' SET @categoria = NEW.categoria_id;' +
      ' SET @categoriaAntiga = OLD.categoria_id;' +
      ' SET @usuario = new.usuario_id;' +
      ' SET @ano = YEAR(new.data);' +
      ' SET @mes = MONTH(new.data);' +
      ` SET @despesaExiste = (SELECT EXISTS(SELECT mes FROM ${database}.relatorios where mes = @mes AND ano = @ano AND usuario_id = @usuario));` +
      ` SET @somaDespesas = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND usuario_id = @usuario);` +
      ` SET @somaCategoria = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND categoria_id = @categoria AND usuario_id = @usuario);` +

      ` IF (@despesaExiste = FALSE) THEN ` +
        ` INSERT INTO ${database}.relatorios (mes, ano, receitas, despesas, usuario_id, alimentacao, saude, moradia, transporte, educacao, imprevistos, outros, lazer, createdAt, updatedAt) VALUES (@mes, @ano, 0, 0, @usuario, 0, 0, 0, 0 ,0 ,0, 0, 0, now(), now());` +
      ` END IF;` +

      ` UPDATE ${database}.relatorios SET despesas = @somaDespesas WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +

      ` IF (@categoriaAntiga) THEN` +
        ` SET @somaCategoriaAntiga = (SELECT sum(valor) FROM ${database}.despesas WHERE YEAR(data) = @ano AND MONTH(data) = @mes AND categoria_id = @categoriaAntiga AND usuario_id = @usuario);` +
        
        ` IF (@somaCategoriaAntiga IS NULL) THEN` +
          ` SET @somaCategoriaAntiga = 0;` +
        ` END IF;` +

        ` CASE` +
          ` WHEN  @categoriaAntiga = 1 THEN UPDATE ${database}.relatorios SET alimentacao = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` WHEN  @categoriaAntiga = 2 THEN UPDATE ${database}.relatorios SET saude = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` WHEN  @categoriaAntiga = 3 THEN UPDATE ${database}.relatorios SET moradia = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` WHEN  @categoriaAntiga = 4 THEN UPDATE ${database}.relatorios SET transporte = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` WHEN  @categoriaAntiga = 5 THEN UPDATE ${database}.relatorios SET educacao = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` WHEN  @categoriaAntiga = 6 THEN UPDATE ${database}.relatorios SET lazer = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` WHEN  @categoriaAntiga = 7 THEN UPDATE ${database}.relatorios SET imprevistos = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
          ` ELSE UPDATE ${database}.relatorios SET outros = @somaCategoriaAntiga WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` END CASE;`+
      ` END IF;` +

      ` IF (@somaCategoria IS NULL) THEN` +
        ` SET @somaCategoria = 0;` +
      ` END IF;` +
      
      ' CASE' +
        ` WHEN  @categoria = 1 THEN UPDATE ${database}.relatorios SET alimentacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 2 THEN UPDATE ${database}.relatorios SET saude = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 3 THEN UPDATE ${database}.relatorios SET moradia = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 4 THEN UPDATE ${database}.relatorios SET transporte = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 5 THEN UPDATE ${database}.relatorios SET educacao = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 6 THEN UPDATE ${database}.relatorios SET lazer = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
        ` WHEN  @categoria = 7 THEN UPDATE ${database}.relatorios SET imprevistos = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` + 
        ` ELSE UPDATE ${database}.relatorios SET outros = @somaCategoria WHERE ano = @ano and mes = @mes and usuario_id = @usuario;` +
      ' END CASE;' +

      ' END;'
      )
    },
    
    async down (queryInterface, Sequelize) {
      const sequelize = new Sequelize("", username, password, {
        dialect: dialect,
      });

      return sequelize.query(
        `DROP TRIGGER IF EXISTS ${database}.despesas_AFTER_UPDATE;`
        );
    },
};

