const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Recipe = sequelize.define('recipe',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: Sequelize.TEXT,
    name: Sequelize.STRING,
    imageURL: Sequelize.TEXT,
    imagePath: Sequelize.TEXT,
    servings: Sequelize.INTEGER,
    ingredients: Sequelize.TEXT,
    steps: Sequelize.TEXT,
    kcals: Sequelize.INTEGER,
    carbs: Sequelize.FLOAT,
    protein: Sequelize.FLOAT,
    fat: Sequelize.FLOAT,
    user: Sequelize.TEXT
});

module.exports = Recipe;