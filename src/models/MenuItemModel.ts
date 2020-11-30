import ModelBase from "./ModelBase";
import MenuItemComponent from "./MenuItemComponentModel";
import MenuItemAddOnModel from "./MenuItemAddOnModel";
import {MenuCategory} from "./MenuCategoryModel";

export default class MenuItem {

    public id!: number;
    public name: string = "";
    public description: string = "";
    public proteins: string = "";
    public allergens: string = "";
    public price: number = 0;
    public image: string = "";
    public active!: boolean;
    public spicy!: boolean;
    public category: string = 'en';
    public components!: MenuItemComponent[];
    public add_ons!: MenuItemAddOnModel[];
    public spiciness!: number;
    public note!: string;
    public menu_category!: MenuCategory | number


    constructor(
        id: number = -1,
        name: string = '',
        description: string = '',
        category: string = 'en',
        price: number = 10,
        proteins: string = "",
        allergens: string = "",
        spicy: boolean = false
        ) 
        {
            this.id = id;
            this.name = name;
            this.description = description;
            this.category = category;
            this.price = price;
            this.proteins = proteins;
            this.allergens = allergens;
            this.spicy = spicy;
        }
}

export class MenuItemDTO {

    public id!: number;
    public name: string = "";
    public description: string = "";
    public proteins: string = "";
    public allergens: string = "";
    public price: number = 0;
    public image!: File | string | null;
    public active!: boolean;
    public spicy: boolean = false;
    public category: string = 'en';
}