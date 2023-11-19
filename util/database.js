const Sequelize = require('sequelize');
const { search } = require('../routes/user');

const sequelize = new Sequelize('meal_plans', 'root', 'taiPIAOLI@NGx2003', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;