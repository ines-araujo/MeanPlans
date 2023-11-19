const MAX_ELEMS_PER_PAGE = 24;

const idOfLastElem = [0]; // Smallest ID in the database is 1
let n_pages = 0; // length of idOfLastElem

// HTML Elements
const searchResults = document.getElementById('results');
const filterBox = document.getElementById('name');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

/* Returns an HTML element representing a search result */
function createResultCard(result) {
    // Recipe
    const recipe = document.createElement("li");
    //  Card
    const card = document.createElement("div");
    card.className = "card";
    card.id = result.id;
    const recipe_info = recipeInfo(result.kcals, result.carbs, result.protein, result.fat);
    card.onclick = () => addRecipe(result.id, result.name, recipe_info, result.imageURL, result.servings, result.kcals, result.carbs, result.protein, result.fat, result.ingredients);
    if(parseInt(result.id) > parseInt(idOfLastElem[n_pages])){
        idOfLastElem[n_pages] = result.id;
    }
    //           Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    //              Image
    const img = document.createElement("img");
    img.src = result.imageURL;
    wrapper.appendChild(img);
    card.appendChild(wrapper);
    //          Card Content
    const cardContent = document.createElement("div");
    cardContent.className = "card-content";
    //              Title
    const recipeTitle = document.createElement("h2");
    recipeTitle.className = "recipe-title";
    recipeTitle.innerHTML = result.name;
    cardContent.appendChild(recipeTitle);
    //              Description
    const description = document.createElement("p");
    description.className = "recipe-description";
    description.innerHTML = recipe_info;
    cardContent.appendChild(description);
    card.appendChild(cardContent);
    recipe.appendChild(card);
    return recipe
}

/* Add a new result to the list of results */
function addToSearchResults(result){
    if(searchResults.children.length < MAX_ELEMS_PER_PAGE){
        searchResults.appendChild(createResultCard(result));
    }
}

/* Remove all results from the list of results */
function clearSearchResults(){
    // Remove all children
    while (searchResults.firstChild) {
        searchResults.removeChild(searchResults.lastChild);
      }
}

/* String to pass as the description of a recipe */
function recipeInfo(kcals, carbs, protein, fat){
    return `kcals: ${kcals}\n carbs:  ${carbs}\n protein: ${protein}\n fat: ${fat}`;
}

// XMLHttpRequests
/* Send a request to server */
function sendRequest(){
    clearSearchResults();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            idOfLastElem.push(0);
            n_pages++;
            const recipeSearchResults = JSON.parse(this.responseText);
            for(let i = 0; i < recipeSearchResults.length; i++){
                addToSearchResults(recipeSearchResults[i]);
            }
            stylePrev();
            styleNext();
        }
    };
    xhttp.open("POST", "http://localhost:3000/search-recipes", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    let filters = {
        limit: MAX_ELEMS_PER_PAGE,
        keyWords: getFilters(),
        lastId: idOfLastElem[n_pages]
      };
    xhttp.send(JSON.stringify(filters));
};

function searchWithFilters(){
    idOfLastElem.splice(1, n_pages);
    n_pages = 0;
    sendRequest();
}

function getFilters(){
    return [...filterBox.value.split(' ')];
}

function stylePrev(){
    prevBtn.style.display = n_pages > 1 ? 'block' : 'none' ;
}

function styleNext(){
    nextBtn.style.display = searchResults.children.length == MAX_ELEMS_PER_PAGE ? 'block' : 'none' ;
}

function seePrev(){
    if(n_pages > 1){
        idOfLastElem.splice(n_pages - 1, 2);
        n_pages -= 2;
        sendRequest();
    }
}

function seeNext(){
    if(searchResults.children.length == MAX_ELEMS_PER_PAGE){
        sendRequest();
    }
}