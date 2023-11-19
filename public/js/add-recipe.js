const MAX_INGREDIENTS = 100;
const MAX_STEPS = 100;

// JavaScript to toggle between file input and URL input
const imageUrlInput = document.getElementById("image-url");
const fileInput = document.getElementById("image-file");
const toggleButton = document.getElementById("toggle-input");

/*toggleButton.addEventListener("click", function () {
    if (imageUrlInput.style.display === "none") {
        imageUrlInput.style.display = "block";
        fileInput.style.display = "none";
        toggleButton.innerHTML = 'Image File';
    } else {
        imageUrlInput.style.display = "none";
        fileInput.style.display = "block";
        toggleButton.innerHTML = 'Image URL';
    }
});*/

// JavaScript for adding dynamic ingredient and step fields
document.getElementById("add-ingredient").addEventListener("click", function () {
    const ingredientsList = document.getElementById("ingredients-list");
    if(ingredientsList.children.length < MAX_INGREDIENTS){
        const newIngredient = document.createElement("li");
        newIngredient.innerHTML = `
            <input type="text" draggable="true"name="ingredient[]" required>
            <input type="number" name="quantity[]" step="0.01" min="0.01" required>
            <select name="unit[]" requireds>
                <option value="unit">unit</option>
                <option value="miligrams">mg</option>
                <option value="grams">g</option>
                <option value="kilograms">kg</option>
                <option value="ounces">oz</option>
                <option value="liters">l</option>
                <option value="mililiters">ml</option>
                <option value="decicentiliters">dl</option>
                <option value="centiliters">cl</option>
                <option value="cups">cup</option>
                <option value="tablespoon">tbsp</option>
                <option value="teaspoon">tsp</option>
                <option value="pinch">pinch</option>
                <option value="slice">slice</option>
            </select>
            <button type="button" class="delete">+</button>`;
        newIngredient.classList.add("draggable");
        newIngredient.draggable = true;
        ingredientsList.appendChild(newIngredient);
        addDeleteHandler(newIngredient);
    }
});

document.getElementById("add-step").addEventListener("click", function () {
    const stepsList = document.getElementById("steps-list");
    if(stepsList.children.length < MAX_STEPS){
        const newStep = document.createElement("li");
        newStep.innerHTML = `
            <textarea type="text" name="step[]"></textarea>
            <button type="button" class="delete">+</button>`;
        newStep.classList.add("draggable");
        newStep.draggable = true;
        stepsList.appendChild(newStep);
        addDeleteHandler(newStep);
    }
});

// Function to add delete handlers to newly created items
function addDeleteHandler(item) {
    const deleteButton = item.querySelector(".delete");
    deleteButton.addEventListener("click", function () {
        item.remove();
    });
}