import Service from './Service';
import Recipe from "../models/RecipeModel";
import RecipeIngredient from "../models/RecipeIngredientModel";


class RecipeService extends Service {
    appName = 'dashboard';
    view = 'recipe';

    public attachIngredient = (recipe: Recipe, recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> => {
        return this._post(`${this.appName}/${this.view}/${recipe.id}/attach_ingredient/`, recipeIngredient);
    }
}

export default new RecipeService();