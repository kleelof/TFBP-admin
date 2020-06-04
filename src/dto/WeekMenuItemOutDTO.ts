export default class WeekMenuItemOutDTO {

    public id!: number;
    public sold_out: boolean = false;
    public price: string = "";
    public menu_item!: number;
    public to_week!: number;

    constructor(to_week: number, menu_item: number, sold_out: boolean, price: string) {
        this.to_week = to_week;
        this.menu_item = menu_item;
        this.sold_out = sold_out;
        this.price = price; 
    }
}