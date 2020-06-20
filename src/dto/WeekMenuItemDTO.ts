import {MenuItemDTO} from "../models/MenuItemModel";
import WeekDTO from "./WeekDTO";
import WeekMenuItemOutDTO from "./WeekMenuItemOutDTO";

export default class WeekMenuItemDTO { 

    public id!: number;
    public sold_out: boolean = false;
    public price: string = "";
    public menu_item!: MenuItemDTO;
    public to_week!: WeekDTO;

    constructor(to_week: WeekDTO, menu_item: MenuItemDTO, sold_out: boolean, price: string) {
        this.to_week = to_week;
        this.menu_item = menu_item;
        this.sold_out = sold_out;
        this.price = price;
    }

    public getSubmitDTO = (): WeekMenuItemOutDTO => {
        return new WeekMenuItemOutDTO(this.to_week.id, this.menu_item.id, this.sold_out, this.price)
    }
}