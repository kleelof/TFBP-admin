import ModelBase from "./ModelBase";
import Recipe from "./RecipeModel";

export default class RecipeNote extends ModelBase {
    public text!: string;
    public recipe!: Recipe;
}