import ModelBase from "./ModelBase";
import {MenuCategory} from "./MenuCategoryModel";
import MenuItem from "./MenuItemModel";

export default class MenuCategoryItem extends ModelBase{

    public menu_category!: MenuCategory | number;
    public sold_out!: boolean;
    public menu_item!: MenuItem
    public price!: number

    constructor(
        menu_category: MenuCategory | number = -1,
        menu_item: MenuItem = new MenuItem(),
        price: number = 0,
        sold_out: boolean = false
    ) {
        super();

        this.menu_category = menu_category;
        this.menu_item = menu_item;
        this.sold_out = sold_out;
        this.price = price;
    }
}