// HTML Elements
const generalShoppingList = document.getElementById('shopping-list');
const weekShoppingList = document.getElementById('week-shopping-list');
const monShoppingList = document.getElementById("mon-week-shopping-list");
const tueShoppingList = document.getElementById("tue-week-shopping-list");
const wedShoppingList = document.getElementById("wed-week-shopping-list");
const thuShoppingList = document.getElementById("thu-week-shopping-list");
const friShoppingList = document.getElementById("fri-week-shopping-list");
const satShoppingList = document.getElementById("sat-week-shopping-list");
const sunShoppingList = document.getElementById("sun-week-shopping-list");
const n_people = document.getElementById('number_of_people');

let people = 1;
let week = false;
const url = ["../icons/appointment.png", "../icons/list.png"];

/* Changes between general and week view */
function switchView(){
    if(week){
        weekShoppingList.style.display = 'none';
        generalShoppingList.style.display = 'block';
        document.documentElement.style.cssText = `--shop-icon: url(${url[0]})`;
    } else {
        weekShoppingList.style.display = 'block';
        generalShoppingList.style.display = 'none';
        document.documentElement.style.cssText = `--shop-icon: url(${url[1]})`;
    }
    week = !week;
}

/* Returns the appropriate id a shopping list element should have, given the name of the ingredient */
function createIdFromName(name, day){
    return {generalId: `ingredient-${name.toLowerCase()}`, dayId: `${day}-ingredient-${name.toLowerCase()}`};
}

/* Returns the name of a certain ingredient already in the list */
function getName(el){
    const str = el.innerHTML.split(' ');
    let name = '';
    for(let i = 0; i < str.length - 2; i++){
        name += `${str[i]} `;
    }
    return name;
}

/* Returns the amount of a certain ingredient already in the list */
function getAmount(el){
    const str = el.innerHTML.split(' ');
    return parseFloat(str[str.length - 2]);
}

/* Changes the amount of a certain ingredient already in the list */
function setAmount(el, newAmount){
    const name = getName(el);
    const unit = getUnit(el);
    el.innerHTML = getIngredientFormat(name, newAmount, unit);
}

/* Returns the unit of a certain ingredient already in the list */
function getUnit(el){
    const str = el.innerHTML.split(' ');
    return str[str.length - 1];
}

/* Returns the correct format for the ingredient */
function getIngredientFormat(name, amount, unit){
    return `${name.toLowerCase()} ${toCentesimalPrecision(amount)} ${unit}`;
}

/* Selects the right HTML element dor the given */
function selectDay(day) {
    switch (day){
        case 'mon':
            return monShoppingList;
        case 'tue':
            return tueShoppingList;
        case 'wed':
            return wedShoppingList;
        case 'thu':
            return thuShoppingList;
        case 'fri':
            return friShoppingList;
        case 'sat':
            return satShoppingList;
        case 'sun':
            return sunShoppingList;
        default:
            throw new Error("InvalidArgumentExcpetion - day should be 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'");
    }
}

/* Adds all ingredients from a single recipe to the shopping list */
function addToShoppingList(id, day){
    const ingredients = recipeListIngredients[id];
            for(let ingredient of ingredients){
                addIngredientToShoppingList(ingredient.name, ingredient.amount * people, ingredient.unit, day);
            }
}

/* Creates a line with the appropriate format and amount that can be added to the shopping list */
function createShoppingListLine(name, amount, unit, id){
    const li = document.createElement('li');
        li.id = id;
        li.className = 'shoppingListIngredient';
        li.innerHTML = getIngredientFormat(name, parseFloat(amount) * people, unit);
        return li;
}

/* Adds a single ingredient to the Shopping list */
function addIngredientToShoppingList(name, amount, unit, day){
    // Create the appropriate ids
    const IDs = createIdFromName(name, day);

    // Add to general shopping list
    let ingredient = document.getElementById(IDs.generalId); // Get the ingredient (null if it's not yet in the list)
    if(ingredient === null){ // Check if the ingredient is already in the shopping list
        generalShoppingList.appendChild(createShoppingListLine(name, amount, unit, IDs.generalId));
    } else {
        // Assume all ingredients have the same unit while we cannot do unit conversions
        setAmount(ingredient, getAmount(ingredient) + amount);
    }

    // Add to day shopping list
    const dayEl = selectDay(day); // Get the appropriate day element
    ingredient = document.getElementById(IDs.dayId); // Get the ingredient from the day list (null if it's not yet in the list)
    if(ingredient === null){ // Check if the ingredient is already in the shopping list
        dayEl.appendChild(createShoppingListLine(name, amount, unit, IDs.dayId));
    } else {
        // Assume all ingredients have the same unit while we cannot do unit conversions
        setAmount(ingredient, getAmount(ingredient) + amount);
    }

}

/* Removes the right amount of all Ingredients from a single recipe from the shopping list */
function removeFromShoppingList(id, day){
    const ingredients = recipeListIngredients[id];
    if(ingredients != null){
        for(let ingredient of ingredients){
            removeIngredientFromShoppingList(ingredient.name, ingredient.amount * people, ingredient.unit, day)
        }
    }
}

function removeIngredientFromShoppingList(name, amount, unit, day){
    const IDs = createIdFromName(name, day);

    // Remove from general shopping list
    let el = document.getElementById(IDs.generalId);
    if(el != null){
        // Assume all ingredients have the same unit while we cannot do unit conversions
        let newAmount = getAmount(el) - amount;
        if(newAmount < 0.01){
            generalShoppingList.removeChild(el);
        } else {
            setAmount(el, newAmount);
        }
    }

    // Remove from day shopping list
    const dayEl = selectDay(day); // Get the appropriate day element
    el = document.getElementById(IDs.dayId);
    if(el != null){
        // Assume all ingredients have the same unit while we cannot do unit conversions
        let newAmount = getAmount(el) - amount;
        if(newAmount < 0.01){
            dayEl.removeChild(el);
        } else {
            setAmount(el, newAmount);
        }
    }
}

function updateShoppingList(){
    updateGeneralShoppingList(people, n_people.value);
    people = n_people.value;
}

function updateGeneralShoppingList(old, niu){
    const ul = generalShoppingList.children;
    for(let li of ul){
        const amount = getAmount(li);
        setAmount(li, amount * (niu/old));
    }
}