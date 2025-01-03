// Importa o módulo Sequelize para interagir com o banco de dados.
const { Sequelize } = require('sequelize')

// Cria uma instância de conexão com o banco de dados.
const sequelize = new Sequelize('tougths', 'root', '', { // Define os parâmetros de conexão.
    host: 'localhost', // O endereço do servidor do banco de dados (neste caso, local).
    port: 3306, // A porta padrão do MySQL.
    dialect: 'mysql' // Especifica o tipo de banco de dados usado.
})

// Testa a conexão com o banco de dados.
try {
    console.log('Conexão Feita') // Mensagem de sucesso caso a conexão seja estabelecida.
} catch (err) {
    console.log('erro ao conectar ao banco de dados') // Mensagem de erro caso a conexão falhe.
}

// Exporta a instância do Sequelize para ser usada em outros arquivos.
module.exports = sequelize