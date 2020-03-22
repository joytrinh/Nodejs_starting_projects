const Sequelize = require('sequelize')

const sequelize = new Sequelize('nodeComplete', 'tuyentrinh', '123456', {dialect:'mysql',host:'localhost'})

module.exports = sequelize