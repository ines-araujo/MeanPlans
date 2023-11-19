const MaxMealsPerSlot = 20;

// HTML Elements
const form = document.getElementById('form');
const mealGrid = document.getElementById("mealGrid");

// Schedule Model
let schedule = {};

/* Parse meals when editing */
function parseMeals(){
    const editing = String(document.getElementById('editing').value);
    // Update model correctly if we're editing
    if(editing === 'true'){
        // Parse meals and recipes
        const meals = JSON.parse(document.getElementById('meals').value);
        const recipes = JSON.parse(document.getElementById('recipes').value);
        // Retreive all the recipe's info
        // Add all recipes
        for(let recipe of recipes){
            addRecipe(recipe.id, recipe.name, recipe.desc, recipe.imageURL, recipe.servings, recipe.kcals, recipe.carbs, recipe.protein, recipe.fat, recipe.ingredients)
        }
        // Add each recipe to respective meal slot
        // Go throught all meal slots and add necessary recipes
        [...document.getElementsByClassName('meal-slot')].forEach((slot) => {
            //const mealsInSlot = meals[slot.id];
            if(meals.hasOwnProperty(slot.id)){
                const list = meals[slot.id];
                for(let i = 0; i < list.length; i++){
                    addMealToMenu(slot, list[i]);
                }
            }
        });
    }
}

/* Create an empty schedule */
function createSchedule() {
    DAYS.forEach((day) => MEALS.forEach((meal) => schedule[day + "-" + meal] = new Set()));
}

/* Initialise hidden inputs */
function createHiddenInputs(){
    for(entry in schedule){
        let input = document.createElement("input");
        input.type = "hidden";
        input.id = entry + 'Input';
        input.name = entry;
        form.appendChild(input);
    }
}

function updateInput(meal){
    const input = document.getElementById(meal + 'Input');
    let IDs = '';
    for(let id of schedule[meal]){
        IDs += id + ' ';
    }
    input.value = IDs;
}

// Meal Grid (HTML)

/* Auto-populate Week Grid */
function weeklyMealsGrid(){
    MEALS.forEach((meal) => {
        let tag = document.createElement("div");
        tag.className= 'meal-tag'
        let p = document.createElement("p");
        p.innerHTML = meal;
        tag.appendChild(p);
        mealGrid.appendChild(tag);
        for (let i = 0; i < 7; i++) {
            let el = document.createElement("div");
            el.className = 'meal-slot ' + meal;
            el.id = DAYS[i] + "-" + meal;
            let placeholder = createPlaceholder(el, meal, i);
            el.appendChild(placeholder);
            mealGrid.appendChild(el);
        }
    });
    // Create displays for kcals trackers
    mealGrid.appendChild(document.createElement("div")); // Empty slot
    for(let i = 0; i < DAYS.length; i++){
        const slot = document.createElement("div");
        slot.className = 'kcals';
        const n_kcals = document.createElement("span");
        n_kcals.innerHTML = '0';
        n_kcals.id = DAYS[i] + 'kcals';
        const kcals = document.createElement("span");
        kcals.innerHTML = ' kcals';
        slot.appendChild(n_kcals);
        slot.appendChild(kcals);
        mealGrid.appendChild(slot);
    }
}

/* Return a placeholder HTML element that holds the add-to-menu button */
function createPlaceholder(el, meal, day_index){
    let placeholder = document.createElement("div");
    placeholder.className = 'card-placeholder';
    placeholder.onclick = () => addSelectedMealToMenu(el);
    let pad = document.createElement('div');
    pad.className = 'pad';
    placeholder.appendChild(pad);
    let plus = document.createElement('span');
    plus.className = 'card-plus';
    plus.innerHTML = '+';
    placeholder.appendChild(plus);
    return placeholder;
}

/* Make all meal slots clickable */
function makeAllMealSlotsClickable(){
    [...document.getElementsByClassName('meal-slot')].forEach((el) => {
        el.classList.add('sel-meal-slot');
    });
    [...document.getElementsByClassName('card-plus')].forEach((el) => {
        el.style.display = 'inline-block';
    });
}

/* Make all meal slots not clickable */
function makeAllMealSlotsNotClickable(){
    [...document.getElementsByClassName('meal-slot')].forEach((el) => {
        el.classList.remove('sel-meal-slot');
    });
    [...document.getElementsByClassName('card-plus')].forEach((el) => {
        el.style.display = 'none';
    });
}

function addMealToMenu(el, recipeID){
    
    if(recipeID != ""){
        let set = schedule[el.id];
        if(!set.has(recipeID) || set.size >= MaxMealsPerSlot){
            set.add(recipeID);
            // Add to respective input
            updateInput(el.id);
            // Update macros
            addMacros(recipeID);
            const day = el.id.split('-')[0];
            addKcalsToDay(recipeID, day);

            // Add to shopping list
            addToShoppingList(recipeID, day);

            var placeholder;
            for(let i = 0; i < el.children.length; i++){
                if(el.children[i].className === 'card-placeholder'){
                    placeholder = el.children[i];
                    el.removeChild(placeholder);
                    i = el.children.length;
                }
            }

            // Add recipe card
            //  Delete button
            const wrap = document.createElement("div");
            const btn = document.createElement("button");
            btn.className = 'menu-delete';
            btn.id = recipeID; // recipe's ID
            btn.type = 'button';
            btn.innerHTML = '+'
            btn.onclick = () => removeMealFromMenu(el, el.id, recipeID);
            wrap.appendChild(btn);
            //  Card
            const card = document.createElement("div");
            card.className = "menu-card";
            card.id = recipeID;
            //      Wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'wrapper';
            //              Image
            const img = document.createElement("img");
            img.src = document.getElementById(recipeID).firstChild.firstChild.src;
            wrapper.appendChild(img);
            card.appendChild(wrapper);
            //      Card Content
            const cardContent = document.createElement("div");
            cardContent.className = "menu-card-content";
            //              Title
            const recipeTitle = document.createElement("h2");
            recipeTitle.className = "menu-recipe-title";
            recipeTitle.innerHTML = document.getElementById(recipeID).lastChild.firstChild.innerHTML;
            cardContent.appendChild(recipeTitle);
            card.appendChild(cardContent);
            wrap.appendChild(card);
            el.appendChild(wrap);

            // Add placeholder
            el.appendChild(placeholder);
        }
    }
}

/* Add selected recipe to selected time slot */
function addSelectedMealToMenu(el){
    const recipeID = selRecipe;
    addMealToMenu(el, recipeID);
}

/* Add recipe to selected time slot */
function removeMealFromMenu(slot, meal, id){
    let set = schedule[meal];
    if(set.has('' + id) || set.has(id)){ // Conver integer ID into string
        // Remove from set
        set.delete('' + id);
        set.delete(id);
        // Remove from input
        updateInput(meal);
        // Update macros
        substractMacros(id);
        // Update Shopping List
        const day = meal.split('-')[0];
        removeFromShoppingList(id, day);
        substractKcalsFromDay(id, day);
        // Remove graphic element
        let c = [];
        const cards = slot.children;
        for(let i = 0; i < cards.length; i++){
            let d = cards[i];
            if(d.children[0].id == id){
                c.push(d);
            }
        }
        slot.removeChild(c[0]);
        // Replace with plus button if necessary
        if(cards.length <= 0){
            slot.appendChild(Placeholder());
        }
    }
}

function removeAllOccurrencesFromSchedule(id) {
    const mealGridChildren = [...mealGrid.children];
    for(let i = 0; i < mealGridChildren.length; i++){
        if(mealGridChildren[i].className.includes('meal-slot')){
            const slot = mealGridChildren[i];
            const {day, meal} =  mealGridIndexToDayAndMeal(i);
            if(day >= 0 && meal >= 0){
                const mealName = DAYS[day] + "-" + MEALS[meal];
                removeMealFromMenu(slot, mealName, id);
            }
        }
    }
}

function mealGridIndexToDayAndMeal(index){
    if(index >= mealGrid.children.length || index <= 7 || index % 8 === 0){
        return {
            day: -1,
            meal: -1
        };
    } else {
        return {
            day: index % 8 - 1,
            meal: Math.floor(index / 8 - 1)
        };
    }
}