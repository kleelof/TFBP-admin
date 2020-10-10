import ModelBase from "./ModelBase";
import Allergen from "./AllergenModel";
import Ingredient from "./IngredientModel";

export const INGREDIENT_UNIT = [
    'oz',
    'fl oz',
    'ml',
    'l',
    'tbl',
    'tsp',
    'cup',
    'qt',
    'gal',
    'ea'
]
export default class RecipeIngredient extends ModelBase {
    public quantity!: number;
    public unit!: string;
    public variance!: number;
    public ingredient!: Ingredient;
}