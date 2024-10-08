import RecipeIngredient from "../models/RecipeIngredientModel";
import {INGREDIENT_UNIT} from '../models/RecipeIngredientModel';
import Ingredient from "../models/IngredientModel";
import Allergen from "../models/AllergenModel";
import MenuItemAddOn from "../models/MenuItemAddOnModel";
import MenuItemComponentModel from "../models/MenuItemComponentModel";
import AllergenModel from "../models/AllergenModel";

class RecipeHelper {

    public createStringListOfAllergensFromIngredient = (ingredient: Ingredient): string => {
        let list: string = '';
        ingredient.allergens.forEach((allergen: Allergen, index: number) => {
            list += allergen.name;
            if (index < ingredient.allergens.length -1)
                list += ', '
        })
        return list;
    }

    public extractAllergensFromMenuItemComponent = (item: MenuItemAddOn | MenuItemComponentModel): string[] => {
        let allergens: string[] = [];

        if (item.ingredient) {
            allergens = item.ingredient.allergens.map((allergen: Allergen) => allergen.name);
        } else if (item.recipe) {
            item.recipe.ingredients.forEach((ingredient: RecipeIngredient) =>{
                (ingredient.ingredient as Ingredient).allergens.forEach((allergen: Allergen) => {
                    if (allergens.indexOf(allergen.name) < 0)
                        allergens.push(allergen.name);
                })

            })
        }

        return allergens;
    }

    public scaleRecipeIngredient = (ingredient: RecipeIngredient, servings: number, scaleTo: number, yld: number = 1): string => {
        let rawValue: number =  ((ingredient.quantity / servings) * scaleTo / ingredient.yld) / yld;
        let unit: number = ingredient.unit;

        if (unit === 0 && rawValue > 15) { // oz > lb
            rawValue /= 16;
            unit = 1;
        }

        if (unit === 2 && rawValue > 99) { // g > kg
            rawValue /= 1000;
            unit = 3;
        }

        if (unit === 4 && rawValue > 5) { // tsp > fl_oz
            rawValue /= 6;
            unit = 6;
        }

        if (unit === 5 && rawValue > 1) {// tbl > fl_oz
            rawValue /= 2;
            unit = 6;
        }

        if (unit === 6 && rawValue > 7) {// fl_oz > c
            rawValue /= 8;
            unit = 7;
        }

        if (unit === 7 && rawValue > 1) {// c > pint
            rawValue /= 2;
            unit = 8;
        }

        if (unit === 8 && rawValue > 1) { // pint > q
            rawValue /= 2;
            unit = 9;
        }

        if (unit === 9 && rawValue > 3) { // q > gal
            rawValue /= 4;
            unit = 10;
        }

        if (unit === 11 && rawValue > 999) { // ml > l
            rawValue /= 1000;
            unit = 12;
        }

        return `${rawValue.toFixed(2)} ${INGREDIENT_UNIT[unit]}`;
    }
}

export default new RecipeHelper();