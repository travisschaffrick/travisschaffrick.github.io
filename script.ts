type Ingredient = [number, string, string]; // [Amount, Unit, Ingredient]
let ingredients: Ingredient[] = [];

type ConversionIngredient = [number, string];
let conversionIngredient: ConversionIngredient = [1, ""]; // [Amount, Ingredient]

let conversionFactor = -1;

// Constants defining position of corresponding data entry in inputted ingredients
const AMOUNT_INPUT = 0;
const UNIT_INPUT = 1;
const INGREDIENT_INPUT = 2;

const AMOUNT_CONVERSION = 0;
const INGREDIENT_CONVERSION = 1;

let inputtedIngredients: string[] = [];

const recipeField = document.getElementById("recipe") as HTMLElement | null;







// Event listeners

// Auto-clear other field upon typing

document.getElementById("multiple")?.addEventListener("input", () => {
    const convInput = document.getElementById("conversionIngredient") as HTMLInputElement;
    if (convInput) convInput.value = "";
});

document.getElementById("conversionIngredient")?.addEventListener("input", () => {
    const multInput = document.getElementById("multiple") as HTMLInputElement;
    if (multInput) multInput.value = "";
});
// Downlaod button
document.getElementById("downloadBtn")?.addEventListener("click", downloadRecipe);









//
// Main functions
//

function populate(): void {
    ingredients = [];
    conversionFactor = -1;

    for (let i = 0; i < inputtedIngredients.length; i++) {
        const raw = inputtedIngredients[i].split(',').map(s => s.trim());

        if (raw.length !== 3) continue;

        const amount = Number(raw[AMOUNT_INPUT]);
        if (isNaN(amount)) continue;

        const curr: Ingredient = [amount, raw[UNIT_INPUT].trim(), raw[INGREDIENT_INPUT].trim()];
        ingredients.push(curr);

        if (curr[INGREDIENT_INPUT] === conversionIngredient[INGREDIENT_CONVERSION]) {
            conversionFactor = conversionIngredient[AMOUNT_CONVERSION] / curr[AMOUNT_INPUT];
        }
    }

    const multipleField = document.getElementById("multiple") as HTMLInputElement | null;
    if (conversionFactor === -1 && multipleField && multipleField.value) {
        conversionFactor = Number(multipleField.value);
    }
}




function equal(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}







function submitByIngredient(): void {
    const ingredientsField = document.getElementById("ingredients") as HTMLTextAreaElement | null;
    const conversionField = document.getElementById("conversionIngredient") as HTMLTextAreaElement | null;

    if (!ingredientsField || !conversionField || !recipeField) return;

    inputtedIngredients = ingredientsField.value.split('\n');
    const rawConversion = conversionField.value.split(',').map(s => s.trim());
    if (rawConversion.length === 2 && !isNaN(Number(rawConversion[0]))) {
        conversionIngredient = [Number(rawConversion[0]), rawConversion[1]];
    } else {
        recipeField.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Invalid format for conversion ingredient. Use: <code>44, yield</code>
            </div>`;
        return;
    }

    recipeField.innerHTML = ""; // Clear previous output
    populate();

    // Show warning if bad input lines exist
    const badLines = inputtedIngredients.filter(line => {
        const raw = line.split(',');
        if (raw.length !== 3) return true;
        const amount = Number(raw[0]);
        return isNaN(amount);
    });

    if (badLines.length > 0) {
        const alert = document.createElement("div");
        alert.className = "alert alert-warning mt-3";
        alert.role = "alert";
        alert.innerHTML = `
            <strong>Warning:</strong> Some lines were skipped due to formatting issues:<br>
            <ul>${badLines.map(line => `<li><code>${line}</code></li>`).join("")}</ul>
            Expected format: <code>Amount, Unit, Ingredient</code>, e.g. <code>100, grams, flour</code>
        `;
        recipeField.appendChild(alert);
        const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement | null;
        if (downloadBtn) downloadBtn.style.display = "none";
        return;
    }

    // Scale ingredients
    displayScaledIngredients();

    const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement | null;
    if (downloadBtn) downloadBtn.style.display = "inline-block";
}








function submitByMultiple(): void {
    const ingredientsField = document.getElementById("ingredients") as HTMLTextAreaElement | null;
    if (!ingredientsField || !recipeField) return;

    inputtedIngredients = ingredientsField.value.split('\n');
    ingredients = [];
    conversionIngredient = [NaN, ""];

    const multipleField = document.getElementById("multiple") as HTMLInputElement | null;
    if (!multipleField || isNaN(Number(multipleField.value))) {
        recipeField.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Invalid multiplier. Please enter a numeric value like <code>2</code> or <code>0.5</code>.
            </div>`;
        return;
    }

    recipeField.innerHTML = ""; // Clear previous output
    populate();

    // Show warning if bad input lines exist
    const badLines = inputtedIngredients.filter(line => {
        const raw = line.split(',');
        if (raw.length !== 3) return true;
        const amount = Number(raw[0]);
        return isNaN(amount);
    });

    if (badLines.length > 0) {
        const alert = document.createElement("div");
        alert.className = "alert alert-warning mt-3";
        alert.role = "alert";
        alert.innerHTML = `
            <strong>Warning:</strong> Some lines were skipped due to formatting issues:<br>
            <ul>${badLines.map(line => `<li><code>${line}</code></li>`).join("")}</ul>
            Expected format: <code>Amount, Unit, Ingredient</code>, e.g. <code>100, grams, flour</code>
        `;
        recipeField.appendChild(alert);
        const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement | null;
        if (downloadBtn) downloadBtn.style.display = "none";
        return;
    }

    // Scale ingredients
    displayScaledIngredients();

    const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement | null;
    if (downloadBtn) downloadBtn.style.display = "inline-block";
}

function displayScaledIngredients(): void {
    recipeField!.innerHTML = "";  // Clear old output

    for (let i = 0; i < ingredients.length; i++) {
        const node = document.createElement("li");

        // Calculate scaled amount without modifying original
        const scaledAmount = ingredients[i][AMOUNT_INPUT] * conversionFactor;

        // Round to 2 decimals
        const amountRounded = Math.round(scaledAmount * 100) / 100;
        const displayAmount = Number.isInteger(amountRounded) ? amountRounded.toString() : amountRounded.toFixed(2);

        const currIngredient = document.createTextNode(
            `${displayAmount} ${ingredients[i][UNIT_INPUT]} of ${ingredients[i][INGREDIENT_INPUT]}`
        );

        node.appendChild(currIngredient);
        recipeField!.appendChild(node);
    }
}


function downloadRecipe(): void {
    const lines = ingredients.map(ing => {
        return `${ing[AMOUNT_INPUT]} ${ing[UNIT_INPUT]} of ${ing[INGREDIENT_INPUT]}`;
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scaled_recipe.txt";
    a.click();

    URL.revokeObjectURL(url); // Clean up
}
