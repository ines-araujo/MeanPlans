const Sequelize = require('sequelize');
const { search } = require('../routes/user');

const sequelize = new Sequelize('meal_plans', 'root', 'password', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;
