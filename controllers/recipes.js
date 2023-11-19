const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Recipe = require('../models/Recipe');
const Ingredient = require('../util/ingredient');

/* Get all existing recipes */
exports.viewAllRecipes = (req, res, next) => {
    return Recipe.findAll().then(recipes => {
        console.log(recipes);
        res.render('recipes.ejs',{
            title: 'All Recipes',
            recipes: recipes
        });
    }).catch(err => console.log(err));
};

/* Get a list of recipes that satisfy the search criteria */
exports.searchRecipes = (req, res, next) => {
    const settings = req.body;
    const where = settings.keyWords[0] != '' ? {[Op.or]: [{name: {[Op.substring]: settings.keyWords}}, {ingredients: {[Op.substring]: settings.keyWords}}], id: {[Op.gt]: settings.lastId}} : {id: {[Op.gt]: settings.lastId}};
    const filters = {
        limit: settings.limit,
        attributes: ['id', 'servings', 'name', 'imageURL', 'kcals', 'carbs', 'protein', 'fat', 'ingredients'],
        where: where
      };
    // Use the filters to retrieve data from the database
    Recipe.findAll(filters).then(recipes => {
        // Send the data back to the client
        res.json(recipes);
    }).catch(err => console.log(err));
};

exports.addRecipe = (req, res, next) => {
    res.render('edit-recipe.ejs',{
        title: 'Add Recipe',
        editing: false
    });
};

exports.postSaveRecipe = (req, res, next) => {
    
    Recipe.create(parseRecipe(req)).then(result =>{
        console.log(result);
        res.redirect('/recipes');
    }).catch(err => {
        console.log(err);
        res.redirect('/recipes');
    });
};

exports.deleteRecipe = (req, res, next) => {
    Recipe.findByPk(req.params.recipeId).then(recipe => {
        return recipe.destroy();
    }).then(result => {
        console.log(result);
        res.redirect('/recipes');
    }).catch(err => console.log(err));
};

exports.editRecipe = (req, res, next) => {
    Recipe.findByPk(req.params.recipeId).then(recipe => {
        res.render('edit-recipe.ejs',{
            title: 'Edit Recipe',
            editing: true,
            recipe: recipe,
            ingredients: JSON.parse(recipe.ingredients),
            steps: JSON.parse(recipe.steps),
        });
    }).catch(err => console.log(err));
};

exports.recipeDetail = (req, res, next) => {
    // For recipes that are online
    res.redirect('/recipes');
    // For recipes input by the user or with chatgpt
};

exports.postSaveEditedRecipe = (req, res, next) => {
    
    const editedRecipe = parseRecipe(req);

    Recipe.findByPk(req.params.recipeId).then(recipe => {
        recipe.url = editedRecipe.url;
        recipe.name = editedRecipe.name;
        recipe.imageURL= editedRecipe.imageUrl;
        recipe.servings= editedRecipe.servings;
        recipe.ingredients= editedRecipe.ingredients;
        recipe.steps= editedRecipe.steps;
        recipe.kcals= editedRecipe.kcals;
        recipe.carbs= editedRecipe.carbs;
        recipe.protein= editedRecipe.protein;
        recipe.fat= editedRecipe.fat;
        return recipe.save();
    }).then(result =>{
        //console.log(result);
        res.redirect('/recipes');
    }).catch(err => console.log(err));
};

function parseRecipe(req){
    
    const body = req.body;

    let imageURL = body.imageUrl? body.imageUrl : '../public/images/questionMark.png';

    // Create ingredients object (Assume all three lists have the same length)
    let ingredients = [];
    for(let i = 0; i < body.ingredient.length; i++){
        ingredients.push(new Ingredient(body.ingredient[i], body.quantity[i], body.unit[i]));
    }

    let steps = [];
    for(let i = 0; i < body.step.length; i++){
        steps.push(body.step[i]);
    }

    let kcals = body.kcals? parseInt(body.kcals) : 0;
    let carbs = body.carbs? parseFloat(body.carbs) : 0.0;
    let protein = body.protein? parseFloat(body.protein) : 0.0;
    let fat = body.fat? parseFloat(body.fat) : 0.0;

    return {
        url: body.recipeUrl,
        name: body.recipeName,
        imageURL: imageURL,
        servings: parseInt(body.servings),
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        kcals: kcals,
        carbs: carbs,
        protein: protein,
        fat: fat
    };
}