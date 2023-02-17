const {sequelize} = require('./db');
const { Sequelize } = require('sequelize');
// TODO - create a Menu model
const Items = sequelize.define('Items', {
    name: Sequelize.STRING,
    image: Sequelize.STRING,
    price: Sequelize.NUMBER,
    vegetarian: Sequelize.BOOLEAN
})

module.exports = {Items};