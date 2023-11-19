const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const WeeklyMenu = require('../models/WeeklyMenu');
const Recipe = require('../models/Recipe');
const mealNames = require('../util/meal-names');

exports.viewAllMenus = (req, res, next) => {
    WeeklyMenu.findAll().then(menus => {
        console.log(menus);
        res.render('menus.ejs',{
            title: 'All Menus',
            menus: menus
        });
    }).catch(err => console.log(err));
};

exports.addMenu = (req, res, next) => {
    res.render('weekly.ejs',{
        title: 'Add View',
        editing: false
    });
};

exports.postSaveNewMenu = (req, res, next) => {
    WeeklyMenu.create(parseMenu(req)).then(result =>{
        console.log(result);
        res.redirect('/');
    }).catch(err => console.log(err));
}

exports.editMenu = (req, res, next) => {
    // retrieve menu from database
    WeeklyMenu.findByPk(req.params.menuId).then(menu => {
        // retrieve info of recipes the menu contains from database
        if(menu.recipes.length > 2){ // '[]'
            return Recipe.findAll({
                where: {
                  id: {
                    [Op.or]: JSON.parse(menu.recipes).map(x => parseInt(x))
                  }
                }
              }).then(recipes => {
                res.render('weekly.ejs',{
                    title: 'Edit Menu',
                    editing: true,
                    menu: menu,
                    recipes: JSON.stringify(recipes)
                });
            });
        }

        res.render('weekly.ejs',{
            title: 'Edit Menu',
            editing: true,
            menu: menu,
            recipes: JSON.stringify([])
        });

    }).catch(err => console.log(err));
};

exports.postSaveEditedMenu = (req, res, next) => {

    const editedMenu = parseMenu(req);

    WeeklyMenu.findByPk(req.params.menuId).then(menu => {
        console.log(editedMenu.recipes);
        menu.name = editedMenu.name;
        menu.kcals= editedMenu.kcals;
        menu.carbs= editedMenu.carbs;
        menu.protein= editedMenu.protein;
        menu.fat= editedMenu.fat;
        menu.recipes= editedMenu.recipes;
        menu.meals = editedMenu.meals;
        menu.monkcals = editedMenu.monkcals;
        menu.tuekcals = editedMenu.tuekcals;
        menu.wedkcals = editedMenu.wedkcals;
        menu.thukcals = editedMenu.thukcals;
        menu.frikcals = editedMenu.frikcals;
        menu.satkcals = editedMenu.satkcals;
        menu.sunkcals = editedMenu.sunkcals;
        return menu.save();
    }).then(result =>{
        //console.log(result);
        res.redirect('/menus');
    }).catch(err => console.log(err));
}

exports.deleteMenu = (req, res, next) => {
    WeeklyMenu.findByPk(req.params.menuId).then(menu => {
        return menu.destroy();
    }).then(result => {
        console.log(result);
        res.redirect('/menus');
    }).catch(err => console.log(err));
};

function parseMenu(req){
    
    const body = req.body;
    const meals = {};
    console.log(body);
    
    mealNames.forEach(meal => {
        const str = body[meal];
        console.log(str);
        if(str){
            const arr = str.split(' ');
            arr.length--;
            meals[meal] = arr;
        }
    });
    console.log(meals);
    console.log(JSON.stringify(meals));


    const recipes = body.recipes.split(' ');
    recipes.length--;

    return {
        name: body.menuTitle,
        kcals: 0,
        carbs: body.carbs,
        protein: body.protein,
        fat: body.fat,
        recipes: JSON.stringify(recipes),
        meals: JSON.stringify(meals),
        monkcals: parseInt(body.monkcals),
        tuekcals: parseInt(body.tuekcals),
        wedkcals: parseInt(body.wedkcals),
        thukcals: parseInt(body.thukcals),
        frikcals: parseInt(body.frikcals),
        satkcals: parseInt(body.satkcals),
        sunkcals: parseInt(body.sunkcals),
    };
}