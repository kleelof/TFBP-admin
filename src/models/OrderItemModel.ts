import ModelBase from './ModelBase';
import CartItem from './CartItemModel';
import Order from './OrderModel';

export default class OrderItem extends ModelBase {

    public cart_item!: CartItem;
    public order!: number;

    constructor(
        id: number = -1,
        cart_item: CartItem = new CartItem(),
        order: Order = new Order()
    ) {
        super();
        this.id = id;
        this.cart_item = cart_item;
        this.order = order.id;
    }
}