import MenuItemDTO from "./MenuItemDTO";

export default class WeekDTO {

    public id!: number;
    public date!: string;
    public menu_items!: MenuItemDTO[]

    constructor(date: string){
        this.date = date;
    }
}