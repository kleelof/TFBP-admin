import ModelBase from "./ModelBase";
import Order from "./OrderModel";
import CartItem from "./CartItemModel";

export default class OrderItem extends ModelBase {

    public order!: Order;
    public cart_item!: CartItem;
}