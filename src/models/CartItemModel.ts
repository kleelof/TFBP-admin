import ModelBase from "./ModelBaseModel"
import MenuItem from "./MenuItemModel";
import User from "./UserModel";

export default class CartItem extends ModelBase {

    public quantity: number = 0;
    public price: number = 0; // Capture the DeliveryDayItem price here
    public spicy: number = 0;
    public protein: string = "";
    public delivery_date!: string;
    public menu_item!: MenuItem;
    public ordered_by!: User;

    constructor(delivery_date: string, menu_item: MenuItem, quantity: number, spicy: number, protein: string) {
        super();
        this.delivery_date = delivery_date;
        this.menu_item = menu_item;
        this.quantity = quantity;
        this.spicy = spicy;
        this.protein = protein;
    }
}