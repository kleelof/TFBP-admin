import Ingredient from "../models/IngredientModel";
import Recipe from "../models/RecipeModel";

export default class SearchRecipesAndIngredientsResultDTO {
    public type!: string;
    public item!: Recipe | Ingredient
}