const Sequelize = require('sequelize');

const Recipe = require('../models/Recipe');

exports.getAllRecipes = () => {
    return Recipe.findAll()
}