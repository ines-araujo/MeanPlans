const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const MEALS = ['breakfast', 'morning snack', 'lunch', 'afternoon snack', 'dinner'];

// When the window loads

window.addEventListener('load', (event) => {
    recipeGrids();
    weeklyMealsGrid();
    createSchedule();
    createHiddenInputs();
    switchView();
    parseMeals();
});