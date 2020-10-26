import Recipe from "./RecipeModel";
import MenuItem from "./MenuItemModel";
import Ingredient from "./IngredientModel";
import ModelBase from "./ModelBase";

export default class MenuComponentsBaseModel extends ModelBase {

    public recipe: Recipe | undefined;
    public menu_item!: MenuItem;
    public ingredient: Ingredient | undefined;

    public quantity!: number;
    public unit!: number;

}