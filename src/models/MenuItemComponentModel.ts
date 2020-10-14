import Recipe from "./RecipeModel";
import MenuItem from "./MenuItemModel";
import MenuComponentsBaseModel from "./MenuComponentsBaseModel";

export default class MenuItemComponent extends MenuComponentsBaseModel {

    constructor(
        id: number = -1,
        recipe: Recipe,
        menu_item: MenuItem
    ) {
        super();
        this.id = id;
        this.recipe = recipe;
        this.menu_item = menu_item;
    }
}