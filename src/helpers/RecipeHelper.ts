import RecipeIngredient from "../models/RecipeIngredientModel";
import {INGREDIENT_UNIT} from '../models/RecipeIngredientModel';

class RecipeHelper {

    public scaleRecipeIngredient = (ingredient: RecipeIngredient, servings: number, count: number): string => {
        let rawValue: number =  (ingredient.quantity / servings) * count;
        let unit: number = ingredient.unit;

        if (unit === 0 && rawValue > 15) { // oz > lb
            rawValue /= 16;
            unit = 1;
        }

        if (unit === 2 && rawValue > 99) { // g > kg
            rawValue /= 1000;
            unit = 3;
        }

        if (unit === 4 && rawValue > 5) { // tsp > oz
            rawValue /= 6;
            unit = 6;
        }

        if (unit === 5 && rawValue > 2) {// tbl > oz
            rawValue /= 3;
            unit = 6;
        }

        if (unit === 6 && rawValue > 7) {// oz > c
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

        if (unit === 11 && rawValue > 1000) { // ml > l
            rawValue /= 1000;
            unit = 12;
        }

        return `${rawValue.toFixed(2)} ${INGREDIENT_UNIT[unit]}`;
    }
}

export default new RecipeHelper();