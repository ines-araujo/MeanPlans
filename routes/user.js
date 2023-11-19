const express = require('express');

const errorController = require('../controllers/error');
const menuController = require('../controllers/menus');
const recipeController = require('../controllers/recipes');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('home.ejs',{
        title: 'All Menus'
    });
});

router.get('/menus', menuController.viewAllMenus); // Get list of menus

router.post('/search-recipes', recipeController.searchRecipes); // Search for specific recipes

router.get('/edit-menu/:menuId', menuController.editMenu); // Enter the weekly form

router.get('/add-menu', menuController.addMenu); // Enter the weekly form

router.post('/save-menu', menuController.postSaveNewMenu); // Save a new menu

router.post('/save-edited-menu/:menuId', menuController.postSaveEditedMenu); // Save an edited menu

router.get('/weekly-view/:menuId', menuController.editMenu); // Enter the weekly form

router.get('/delete-menu/:menuId', menuController.deleteMenu); // Delete an existing Recipe

router.get('/recipes', recipeController.viewAllRecipes); // Get list of recipes

router.get('/add-recipe', recipeController.addRecipe); // Enter the edit-recipe form

router.get('/edit-recipe/:recipeId', recipeController.editRecipe); // Enter the weekly form

router.post('/save-edited-recipe/:recipeId', recipeController.postSaveEditedRecipe);

router.post('/save-recipe', recipeController.postSaveRecipe); // Save a new Recipe

router.get('/delete-recipe/:recipeId', recipeController.deleteRecipe); // Delete an existing Recipe

router.get('/recipe-view/:recipeId', recipeController.recipeDetail); // Go to original site

router.use('/', errorController.error); // 404 page

module.exports = router;