var ingredients = [];
var conversionIngredient = [];
var conversionFactor = 0;
var GRAMS = 0;
var NAME = 1;

var inputtedIngredients = ""

function calculate() {
    
}

function submit() {
    inputtedIngredients = document.getElementById("ingredients").value.split('\n');
    conversionIngredient = document.getElementById("conversionIngredient").value.split(',');
    recipeField = document.getElementById("recipe");
    for (let i = 0; i < inputtedIngredients.length; i++) {
        var curr = inputtedIngredients[i];
        curr = curr.split(',')
        ingredients[i] = [curr[0], curr[1].toLowerCase()]
        if (ingredients[i][NAME] == conversionIngredient[NAME]) {
            conversionFactor = conversionIngredient[GRAMS] / ingredients[i][GRAMS]
        }
    }
    for (let i = 0; i < ingredients.length; i++) {
        const node = document.createElement("li")
        ingredients[i][GRAMS] *= conversionFactor;
        currIngredient = document.createTextNode(String(ingredients[i][GRAMS]) + "g of " + ingredients[i][NAME]);
        node.appendChild(currIngredient)
        recipeField.appendChild(node);
    }
}