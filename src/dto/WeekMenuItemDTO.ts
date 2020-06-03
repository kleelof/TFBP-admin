import MenuItemDTO from "./MenuItemDTO";
import WeekDTO from "./WeekDTO";
import WeekMenuItemOutDTO from "./WeekMenuItemOutDTO";

export default class WeekMenuItemDTO {

    public id!: number;
    public sold_out: boolean = false;
    public price: string = "";
    public menu_item!: MenuItemDTO;
    public spicy!: boolean
    public to_week!: WeekDTO;

    constructor(to_week: WeekDTO, menu_item: MenuItemDTO, sold_out: boolean, price: string, spicy: boolean) {
        this.to_week = to_week;
        this.menu_item = menu_item;
        this.sold_out = sold_out;
        this.price = price;
        this.spicy = spicy; 
    }

    public getSubmitDTO = (): WeekMenuItemOutDTO => {
        return new WeekMenuItemOutDTO(this.to_week.id, this.menu_item.id, this.sold_out, this.price, this.spicy)
    }
}