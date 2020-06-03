import WeekMenuItemDTO from "./WeekMenuItemDTO";

export default class WeekDTO {

    public id!: number;
    public date!: string;
    public menu_items!: WeekMenuItemDTO[]

    constructor(date: string){
        this.date = date;
    }
}