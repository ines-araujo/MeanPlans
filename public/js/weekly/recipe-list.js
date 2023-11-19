const MAX_RECIPES_PER_MENU = 175;

// Model Elements
const recipes = new Set(); // Recipes that can be added to the schedule
const macros = {};
const recipeListIngredients = {};

//HTML Elements
const recipeList = document.getElementById("recipeList");
const recipesInput = document.getElementById('recipeListInput');
let selRecipe = ''; // ID of the current selected recipe to place in the schedule

/* Update number of recipes - corrects the style of the recipe lists */
function recipeGrids(){
    const n_recipes = recipeList.getElementsByTagName("li").length;
    recipeList.style.gridTemplateColumns = `repeat(${n_recipes}, 1fr)`;
    recipeListOverlay.style.gridTemplateColumns = `repeat(${n_recipes}, 1fr)`;
}

/* Recipe Cards -->
<li>
    <div class="vertical-stack">
        <div><button type="button" class="delete" id="delete-<%= recipe.id %>">+</button></div>
        <div class="card">
            <img src="<%= recipe.image %>" alt='recipe photo'>
            <div class="card-content">
                <h2 class="recipe-title"><%= recipe.title %></h2>
                <p class="recipe-description"><%= recipe.description %></p>
            </div>
        </div>
    </div>
</li>
*/

/* create an HTML element with the card template */
/* Creates a delete button with id: delete-id and a card with id:id */
/* allowSelection means that the card can be selected to add it to the schedule */
function createRecipeCard(id, name, desc, imageURL, allowSelection){
    // Recipe
    const li = document.createElement("li");
    const recipe = document.createElement("div");
    recipe.className = 'vertical-stack';
    //      Delete button
    const btnWrapper = document.createElement("div");
    btnWrapper.className = "delete-wrapper";
    const btn = document.createElement("button");
    btn.className = 'delete';
    btn.id = `delete-${id}`;
    btn.type = 'button';
    btn.innerHTML = '+'
    const recId = id;
    btn.onclick = () => removeRecipe(recId);
    btnWrapper.appendChild(btn);
    recipe.appendChild(btnWrapper);
    //      Card
    const card = document.createElement("div");
    card.className = "card";
    card.id = id;
    if(allowSelection){
        card.onclick = () => selectThisRecipe(card);
    }
    //           Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    //              Image
    const img = document.createElement("img");
    img.src = imageURL;
    wrapper.appendChild(img);
    card.appendChild(wrapper);
    //          Card Content
    const cardContent = document.createElement("div");
    cardContent.className = "card-content";
    //              Title
    const recipeTitle = document.createElement("h2");
    recipeTitle.className = "recipe-title";
    recipeTitle.innerHTML = name; //TO-DO: Dummy title
    cardContent.appendChild(recipeTitle);
    //              Description
    const description = document.createElement("p");
    description.className = "recipe-description";
    description.innerHTML = desc;
    cardContent.appendChild(description);
    card.appendChild(cardContent);
    recipe.appendChild(card);
    li.appendChild(recipe);
    return li;
}


/* Add a new recipe to the recipe list */
function addRecipe(id, name, desc, imageURL, servings, kcals, carbs, protein, fat, ingredients){
    if(!recipes.has(id) && recipes.size <= MAX_RECIPES_PER_MENU){
        // Include recipe in list
        recipes.add(id);
        updateRecipeInput();
        macros[id] = {kcals: kcals, carbs: carbs, protein: protein, fat:fat};
        addToRecipeListIngredients(id, ingredients, servings);
        // Create HTML element
        recipeList.appendChild(createRecipeCard(id, name, desc, imageURL, true));
        recipeListOverlay.appendChild(createRecipeCard(id, name, desc, imageURL, false));
        // Update grid to make it look cute
        recipeGrids();
    }
}

/* Add list of ingredients for 1 serving to the list of recipe's ingredients */
function addToRecipeListIngredients(id, ingredients, servings) {
    const ingredientList = JSON.parse(ingredients);
    if(parseInt(servings) > 1){
        for(let ingredient of ingredientList){
            ingredient.amount = toCentesimalPrecision(ingredient.amount/parseInt(servings));
        }
    }
    recipeListIngredients[id] = ingredientList;
}

function updateRecipeInput(){
    let IDs = '';
    for(let id of recipes){
        IDs += `${id} `;
    }
    recipesInput.value = IDs;
}

/* Remove a recipe from the recipe list and schedule */
function removeRecipe(id){

    if(recipes.has(id)){
        // Remove from set of recipes that can be added to the schedule
        recipes.delete(id);
        updateRecipeInput();
        // Remove HTML element from recipe lists
        //  RecipeList
        removeCardFromRecipeList(recipeList, id);
        // RecipeListOverlay    
        removeCardFromRecipeList(recipeListOverlay, id);
        // Update grids
        recipeGrids();
        // If this recipe was selected
        if(id == selRecipe) {
            selRecipe = '';
            makeAllMealSlotsNotClickable();
        }
        // Delete all occurrences of the recipe from schedule and HTML from menu grid
        removeAllOccurrencesFromSchedule(id);
    }
}

function removeCardFromRecipeList(list, id){
    const recipeListChildren = [...list.children];
        const len = recipeListChildren.length;
        for(let i = 0; i < len; i++){
            const li = recipeListChildren[i];
            const vStackChildren = [...[...recipeListChildren[i].children][0].children];
            const card = vStackChildren[1];
            if(card.id == id){
                list.removeChild(li);
                i = len;
            }
        }
}

// Select Recipe
/* Mark clicked recipe as selected and update classes */
function selectThisRecipe(card) {
    if(card.className === 'card') {
        if(selRecipe != ''){
            // Changes the style of the first element with the recipe's ID to card
            // recipe list should always be the first element that has a card with the recipe's ID as its id property
            let old = document.getElementById(selRecipe);
            old.className= 'card';
        }
        card.className = 'sel-card';
        selRecipe = card.id;
        makeAllMealSlotsClickable();
    } else {
        card.className = 'card';
        selRecipe = '';
        makeAllMealSlotsNotClickable();
    }
}