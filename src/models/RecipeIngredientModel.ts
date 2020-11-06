import ModelBase from "./ModelBase";
import Ingredient from "./IngredientModel";
import Recipe from "./RecipeModel";

export const INGREDIENT_UNIT: string[] = [
    'oz', //0
    'lb',
    'g',
    'kg', // 3
    'fl oz',
    'cup', // 5
    'pint',
    'qt',
    'gal', //9
    'ml',
    'l',
    'ea'
]

export default class RecipeIngredient extends ModelBase {
    public quantity!: number;
    public unit!: number;
    public yld!: number;
    public ingredient!: Ingredient | number;
    public recipe!: Recipe | number;

    constructor (
        quantity: number = 0,
        unit: number = 0,
        yld: number = 1,
        ingredient: Ingredient | number = -1,
        recipe: Recipe | number = -1
    ) {
        super();
        this.quantity = quantity;
        this.unit = unit;
        this.yld = yld;
        this.ingredient = ingredient;
        this.recipe = recipe;
    }

    public scale = (): number => {
        return this.quantity;
    }
}