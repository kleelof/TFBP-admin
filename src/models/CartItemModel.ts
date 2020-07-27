import ModelBase from "./ModelBase"
import MenuItem from "./MenuItemModel";
import User from "./User";
import DeliveryDay from "./DeliveryDayModel";
import DeliveryWindow from "./DeliveryWindowModel";

export class CartItemDTO {

    public id!: number | undefined;
    public quantity: number = 0;
    public spicy: number = 0;
    public protein: string = "";
    public delivery_date!: string;
    public delivery_window!: number;
    public menu_item!: number;
    public ordered_by!: number;
    public price!: number;
    public cart_id: string = "";

    constructor(cartItem: CartItem) {
        this.id = cartItem.id;
        this.ordered_by = cartItem.ordered_by ? cartItem.ordered_by.id : 0;
        this.delivery_date = cartItem.delivery_date;
        this.delivery_window = cartItem.delivery_window.id;
        this.menu_item = cartItem.menu_item.id;
        this.quantity = cartItem.quantity;
        this.spicy = cartItem.spicy;
        this.price = cartItem.price;
        this.protein = cartItem.protein;
        this.cart_id = cartItem.cart_id;
    }
}

export default class CartItem extends ModelBase { 

    public quantity: number = 0;
    public spicy: number = 0;
    public protein: string = "";
    public delivery_date!: string;
    public delivery_window!: DeliveryWindow;
    public menu_item!: MenuItem;
    public ordered_by!: User;
    public price!: number;
    public cart_id: string = "";

    constructor(
        ordered_by: User = new User(),
        delivery_date: string = "2020-7-4",
        delivery_window: DeliveryWindow = new DeliveryWindow(),
        menu_item: MenuItem = new MenuItem(),
        quantity: number = 0,
        price: number = 0,
        spicy: number = 1,
        protein: string = '',
        cart_id: string = '',
        id: number = 0) 
        
        {
            super();

            this.ordered_by = ordered_by;
            this.delivery_date = delivery_date;
            this.delivery_window = delivery_window;
            this.menu_item = menu_item;
            this.quantity = quantity;
            this.price = price;
            this.spicy = spicy;
            this.protein = protein;
            this.id = id;
            this.cart_id = cart_id;
        }
}