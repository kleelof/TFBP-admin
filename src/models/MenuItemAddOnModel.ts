import MenuComponentsBaseModel from "./MenuComponentsBaseModel";
import Recipe from "./RecipeModel";
import MenuItem from "./MenuItemModel";
import Ingredient from "./IngredientModel";

export default class MenuItemAddOn extends MenuComponentsBaseModel {
    public price!: number;
    public name!: string;

    constructor(
        quantity: number = 0,
        unit: number = 0,
        price: number = 0,
        name: string = '',
        recipe: Recipe | undefined = undefined,
        menu_item: MenuItem = new MenuItem(),
        ingredient: Ingredient | undefined = undefined
    ) {
        super();
        this.quantity = quantity;
        this.unit = unit;
        this.price = price;
        this.name = name;
        this.recipe = recipe;
        this.menu_item = menu_item;
        this.ingredient = ingredient;
    }

}