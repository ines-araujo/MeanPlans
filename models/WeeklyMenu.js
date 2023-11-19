const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const WeeklyMenu = sequelize.define('weeklyMenu',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    kcals: Sequelize.STRING,
    carbs: Sequelize.FLOAT,
    protein: Sequelize.FLOAT,
    fat: Sequelize.FLOAT,
    recipes: Sequelize.TEXT,
    meals: Sequelize.TEXT,
    monkcals: Sequelize.INTEGER,
    tuekcals: Sequelize.INTEGER,
    wedkcals: Sequelize.INTEGER,
    thukcals: Sequelize.INTEGER,
    frikcals: Sequelize.INTEGER,
    satkcals: Sequelize.INTEGER,
    sunkcals: Sequelize.INTEGER,
    user: Sequelize.TEXT
});

module.exports = WeeklyMenu;