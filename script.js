var ingredients = [];
var conversionIngredient = [];
var conversionFactor = -1;

// Constants defining position of corresponding data entry in inputted ingredients
var AMOUNT_INPUT = 0;
var UNIT_INPUT = 1;
var INGREDIENT_INPUT = 2;

var AMOUNT_CONVERSION = 0;
var INGREDIENT_CONVERSION = 1;

var inputtedIngredients = ""

function reset() {
    ingredients = [];
    conversionIngredient = [];
}

function populate() {
    // Populates the ingredients and conversion factor
    for (let i = 0; i < inputtedIngredients.length; i++) {
        var curr = inputtedIngredients[i];
        curr = curr.split(',') // convert string to array in format curr = [amount, unit, ingredient]
        curr[AMOUNT_INPUT] = Number(curr[AMOUNT_INPUT])
        console.log(curr)
        ingredients[i] = curr;
        if (ingredients[i][INGREDIENT_INPUT] == conversionIngredient[INGREDIENT_CONVERSION]) {
            conversionFactor = conversionIngredient[AMOUNT_CONVERSION] / ingredients[i][AMOUNT_INPUT]; // Finding a scalar to multiply recipe by
        }
    }

    if (conversionFactor == -1) { // Then it has not been updated
        // So user is likely using scalar feature
        if (document.getElementById("multiple").value) {
            conversionFactor = Number(document.getElementById("multiple").value);
        }
    }
}

function verify_output() {
    // Ensure there are ingredients before outputting
    console.log("ran")
    console.log(conversionFactor);
    console.log("ingredients: " + ingredients)
    
    if (conversionFactor == -1 || isNaN(conversionFactor)) {
        recipeField.innerHTML = "No Scaling Factor";
    }

    if (inputtedIngredients == "") {
        recipeField.innerHTML = "No Ingredients";
    }
}


function submit_by_ingredient() {
    // Setup
    reset();
    inputtedIngredients = document.getElementById("ingredients").value.split('\n');
    conversionIngredient = document.getElementById("conversionIngredient").value.split(','); // Specific ingredient that is
                                                                                             // used to convert by
    recipeField = document.getElementById("recipe"); // output
    populate();

    // Going through each ingredient and scaling them
    for (let i = 0; i < ingredients.length; i++) {
        const node = document.createElement("li"); // to save the recipe as a list
        ingredients[i][AMOUNT_INPUT] *= conversionFactor;
        // rounding
        ingredients[i][AMOUNT_INPUT] = Math.round(ingredients[i][AMOUNT_INPUT] * 100) / 100
        currIngredient = document.createTextNode(String(ingredients[i][AMOUNT_INPUT]) + " " + ingredients[i][UNIT_INPUT] + " of " + ingredients[i][INGREDIENT_INPUT]);
        
        // check if already has ingredients in box
        if (i == 0) {
            recipeField.innerHTML = "";
        }

        node.appendChild(currIngredient);
        recipeField.appendChild(node);
    }
    verify_output();
}

function submit_by_given_multiple() {
    // Setup
    reset();
    inputtedIngredients = document.getElementById("ingredients").value.split('\n');
    recipeField = document.getElementById("recipe"); // output
    populate();

    // Going through each ingredient and scaling them
    for (let i = 0; i < ingredients.length; i++) {
        const node = document.createElement("li"); // to save the recipe as a list
        ingredients[i][AMOUNT_INPUT] *= conversionFactor;
        // rounding
        ingredients[i][AMOUNT_INPUT] = Math.round(ingredients[i][AMOUNT_INPUT] * 100) / 100
        currIngredient = document.createTextNode(String(ingredients[i][AMOUNT_INPUT]) + " " + ingredients[i][UNIT_INPUT] + " of " + ingredients[i][INGREDIENT_INPUT]);
        
        // check if already has ingredients in box
        if (i == 0) {
            recipeField.innerHTML = "";
        }

        node.appendChild(currIngredient);
        recipeField.appendChild(node);
    }
    verify_output();
}