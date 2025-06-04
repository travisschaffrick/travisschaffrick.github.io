var _a, _b, _c;
var ingredients = [];
var conversionIngredient = [1, ""]; // [Amount, Ingredient]
var conversionFactor = -1;
// Constants defining position of corresponding data entry in inputted ingredients
var AMOUNT_INPUT = 0;
var UNIT_INPUT = 1;
var INGREDIENT_INPUT = 2;
var AMOUNT_CONVERSION = 0;
var INGREDIENT_CONVERSION = 1;
var inputtedIngredients = [];
var recipeField = document.getElementById("recipe");
// Event listeners
// Auto-clear other field upon typing
(_a = document.getElementById("multiple")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", function () {
    var convInput = document.getElementById("conversionIngredient");
    if (convInput)
        convInput.value = "";
});
(_b = document.getElementById("conversionIngredient")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", function () {
    var multInput = document.getElementById("multiple");
    if (multInput)
        multInput.value = "";
});
// Downlaod button
(_c = document.getElementById("downloadBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", downloadRecipe);
//
// Main functions
//
function populate() {
    ingredients = [];
    conversionFactor = -1;
    for (var i = 0; i < inputtedIngredients.length; i++) {
        var raw = inputtedIngredients[i].split(',');
        if (raw.length !== 3)
            continue;
        var amount = Number(raw[AMOUNT_INPUT]);
        if (isNaN(amount))
            continue;
        var curr = [amount, raw[UNIT_INPUT].trim(), raw[INGREDIENT_INPUT].trim()];
        ingredients.push(curr);
        if (curr[INGREDIENT_INPUT] === conversionIngredient[INGREDIENT_CONVERSION]) {
            conversionFactor = conversionIngredient[AMOUNT_CONVERSION] / curr[AMOUNT_INPUT];
        }
    }
    var multipleField = document.getElementById("multiple");
    if (conversionFactor === -1 && multipleField && multipleField.value) {
        conversionFactor = Number(multipleField.value);
    }
}
function equal(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}
function submitByIngredient() {
    var ingredientsField = document.getElementById("ingredients");
    var conversionField = document.getElementById("conversionIngredient");
    if (!ingredientsField || !conversionField || !recipeField)
        return;
    inputtedIngredients = ingredientsField.value.split('\n');
    var rawConversion = conversionField.value.split(',');
    if (rawConversion.length === 2 && !isNaN(Number(rawConversion[0]))) {
        conversionIngredient = [Number(rawConversion[0]), rawConversion[1]];
    }
    else {
        recipeField.innerHTML = "\n            <div class=\"alert alert-warning\" role=\"alert\">\n                Invalid format for conversion ingredient. Use: <code>44, yield</code>\n            </div>";
        return;
    }
    recipeField.innerHTML = ""; // Clear previous output
    populate();
    // Show warning if bad input lines exist
    var badLines = inputtedIngredients.filter(function (line) {
        var raw = line.split(',');
        if (raw.length !== 3)
            return true;
        var amount = Number(raw[0]);
        return isNaN(amount);
    });
    if (badLines.length > 0) {
        var alert_1 = document.createElement("div");
        alert_1.className = "alert alert-warning mt-3";
        alert_1.role = "alert";
        alert_1.innerHTML = "\n            <strong>Warning:</strong> Some lines were skipped due to formatting issues:<br>\n            <ul>".concat(badLines.map(function (line) { return "<li><code>".concat(line, "</code></li>"); }).join(""), "</ul>\n            Expected format: <code>Amount, Unit, Ingredient</code>, e.g. <code>100, grams, flour</code>\n        ");
        recipeField.appendChild(alert_1);
        var downloadBtn_1 = document.getElementById("downloadBtn");
        if (downloadBtn_1)
            downloadBtn_1.style.display = "none";
        return;
    }
    // Scale ingredients
    displayScaledIngredients();
    var downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn)
        downloadBtn.style.display = "inline-block";
}
function submitByMultiple() {
    var ingredientsField = document.getElementById("ingredients");
    if (!ingredientsField || !recipeField)
        return;
    inputtedIngredients = ingredientsField.value.split('\n');
    ingredients = [];
    conversionIngredient = [NaN, ""];
    var multipleField = document.getElementById("multiple");
    if (!multipleField || isNaN(Number(multipleField.value))) {
        recipeField.innerHTML = "\n            <div class=\"alert alert-warning\" role=\"alert\">\n                Invalid multiplier. Please enter a numeric value like <code>2</code> or <code>0.5</code>.\n            </div>";
        return;
    }
    recipeField.innerHTML = ""; // Clear previous output
    populate();
    // Show warning if bad input lines exist
    var badLines = inputtedIngredients.filter(function (line) {
        var raw = line.split(',');
        if (raw.length !== 3)
            return true;
        var amount = Number(raw[0]);
        return isNaN(amount);
    });
    if (badLines.length > 0) {
        var alert_2 = document.createElement("div");
        alert_2.className = "alert alert-warning mt-3";
        alert_2.role = "alert";
        alert_2.innerHTML = "\n            <strong>Warning:</strong> Some lines were skipped due to formatting issues:<br>\n            <ul>".concat(badLines.map(function (line) { return "<li><code>".concat(line, "</code></li>"); }).join(""), "</ul>\n            Expected format: <code>Amount, Unit, Ingredient</code>, e.g. <code>100, grams, flour</code>\n        ");
        recipeField.appendChild(alert_2);
        var downloadBtn_2 = document.getElementById("downloadBtn");
        if (downloadBtn_2)
            downloadBtn_2.style.display = "none";
        return;
    }
    // Scale ingredients
    displayScaledIngredients();
    var downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn)
        downloadBtn.style.display = "inline-block";
}
function displayScaledIngredients() {
    for (var i = 0; i < ingredients.length; i++) {
        var node = document.createElement("li");
        ingredients[i][AMOUNT_INPUT] *= conversionFactor;
        ingredients[i][AMOUNT_INPUT] = Math.round(ingredients[i][AMOUNT_INPUT] * 100) / 100;
        var currIngredient = document.createTextNode("".concat(ingredients[i][AMOUNT_INPUT], " ").concat(ingredients[i][UNIT_INPUT], " of ").concat(ingredients[i][INGREDIENT_INPUT]));
        node.appendChild(currIngredient);
        if (recipeField == null)
            return;
        recipeField.appendChild(node);
    }
}
function downloadRecipe() {
    var lines = ingredients.map(function (ing) {
        return "".concat(ing[AMOUNT_INPUT], " ").concat(ing[UNIT_INPUT], " of ").concat(ing[INGREDIENT_INPUT]);
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "scaled_recipe.txt";
    a.click();
    URL.revokeObjectURL(url); // Clean up
}
