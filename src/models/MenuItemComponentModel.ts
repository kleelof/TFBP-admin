import Recipe from "./RecipeModel";
import MenuItem from "./MenuItemModel";
import MenuComponentsBaseModel from "./MenuComponentsBaseModel";
import Ingredient from "./IngredientModel";

export default class MenuItemComponent extends MenuComponentsBaseModel {

    constructor(
        quantity: number = 0,
        unit: number = 0,
        recipe: Recipe | undefined = undefined,
        menu_item: MenuItem = new MenuItem(),
        ingredient: Ingredient | undefined = undefined
    ) {
        super();
        this.quantity = quantity;
        this.unit = unit;
        this.recipe = recipe;
        this.menu_item = menu_item;
        this.ingredient = ingredient;
    }
}