import ModelBase from "./ModelBase";
import Recipe from "./RecipeModel";
import MenuItem from "./MenuItemModel";

export default class MenuItemComponent extends ModelBase {

    public is_add_on!: boolean;
    public add_on_price!: number;
    public add_on_name!: string;
    public recipe!: Recipe | number;
    public menu_item!: MenuItem | number;

    constructor(
        id: number = -1,
        recipe: Recipe | number = -1,
        menu_item: MenuItem | number = -1,
        is_add_on: boolean = false,
        add_on_price: number = 0,
        add_on_name: string = ''
    ) {
        super();
        this.id = id;
        this.recipe = recipe;
        this.menu_item = menu_item;
        this.is_add_on = is_add_on;
        this.add_on_price = add_on_price;
        this.add_on_name = add_on_name;
    }
}