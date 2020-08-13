import OrderItem from '../src/models/OrderItemModel';
import Order from '../src/models/OrderModel';
import CartItem from '../src/models/CartItemModel';
import { BuildCartItem } from './cartMocks';
import MenuItem from "../src/models/MenuItemModel";

interface IBuildOrderItem {
    count: number,
    cartItem?: CartItem,
    order?: Order
}

export const BuildOrderItem = (params: IBuildOrderItem): any => {
    let items: OrderItem[] = [];

    for(let x: number = 1; x <= params.count; x ++ ) {
        items.push(
            new OrderItem(
                x,
                params.cartItem || BuildCartItem({count: 1}),
                params.order || new Order()
            )
        )
    }
    return items.length > 1 ? items : items[0];
}

interface IOrder {
    count: number
    orderItems?: OrderItem[]
}

export const BuildOrder = (params: IOrder): any => {
    let orders: Order[] = [];

    for (let x: number = 1; x <= params.count; x ++) {
        orders.push(
            new Order(
                x,
                `contact_name_${x}`,
                `email${x}@email.com`,
                '',
                '',
                '',
                '',
                '',
                params.orderItems || [BuildOrderItem({count: 1})],
                '',
                `public_id_${x}`,
                '',
                0
            )
        )
    }

    return orders.length > 1 ? orders : orders[0];
}

interface BuildMenuItem {
    count: number,
    name?: string,
    spicy?: boolean,
    proteins?: string
}

export const BuildMenuItem = (params: BuildMenuItem): any => {
    let items: MenuItem[] = [];

    for(let x: number = 1; x <= params.count; x ++ ) {
        items.push(
            new MenuItem(
                x ,
                params.name || `menu_item_${x}`,
                `description ${x}`,
                'en',
                10,
                params.proteins || '',
                '',
                params.spicy || false
            )
        )
    }
    return items.length > 1 ? items : items[0];
}