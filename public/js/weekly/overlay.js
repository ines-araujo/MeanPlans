// HTML Elements
const recipeListOverlay = document.getElementById("recipeListOverlay");
const overlay = document.getElementById('overlay');
const darkOverlay = document.getElementById('dark-overlay');


/* Display Overlay */
function openOverlay() {
    darkOverlay.style.display = 'block';
    overlay.style.display = 'block'
    searchWithFilters(); // Display by default all recipes
}

/* Hide Overlay */
function closeOverlay() {
    darkOverlay.style.display = 'none';
    overlay.style.display = 'none'
    clearSearchResults();
}

/* Add a recipe card to the results element */
function addToOverlaySearchResults(id, name, imageURL){
    
    // Recipe
    const recipe = document.createElement("li");
    //  Card
    const card = document.createElement("div");
    card.className = "card";
    card.id = id;
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
    recipeTitle.innerHTML = name;
    cardContent.appendChild(recipeTitle);
    //              Description
    const description = document.createElement("p");
    description.className = "recipe-description";
    description.innerHTML = "Dummz description"; //TO-DO: Dummy description
    cardContent.appendChild(description);
    card.appendChild(cardContent);
    recipe.appendChild(card);
    
    const results = document.getElementById('results');
    results.appendChild(recipe);
}