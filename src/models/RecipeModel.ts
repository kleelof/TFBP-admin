import ModelBase from "./ModelBase";
import RecipeIngredient from "./RecipeIngredientModel";

export default class Recipe extends ModelBase {
    public name!: string;
    public description!: string;
    public instructions!: string;
    public is_vegan!: boolean;
    public ingredients!: RecipeIngredient[];
}