import MenuItemDTO from "./MenuItemDTO";

export default class WeekMenuItemDTO {

    public id!: number;
    public sold_out: boolean = false;
    public price: number = 0;
    public menu_item!: MenuItemDTO; 
}