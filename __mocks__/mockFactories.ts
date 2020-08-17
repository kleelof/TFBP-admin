import OrderItem from '../src/models/OrderItemModel';
import Order from '../src/models/OrderModel';
import CartItem from '../src/models/CartItemModel';
import { BuildCartItem } from './cartMocks';
import MenuItem from "../src/models/MenuItemModel";
import Coupon from "../src/models/Coupon";

interface BuildCoupon {
    count: number,
    mode?: number,
    start_value?: number,
    current_value?: number,
    email?: string,
    expire?: string,
    active?: boolean,
    remaining_uses?: number,
    calculation_type?: number
}

export const BuildCoupon = (params: BuildCoupon): any => {
    let items: Coupon[] = [];

    for(let x: number = 1; x <= params.count; x ++ ) {
        items.push(
            new Coupon(
                x,
                'test_code',
                params.active !== false ? true : false,
                params.mode || 0,
                params.calculation_type || 0,
                params.expire || `2021-07-04`,
                params.start_value || .2,
                params.current_value || 0,
                params.remaining_uses || 1,
                params.email || `user_${x}@mail.com`
            )
        )
    }

    return  items.length > 1 ? items : items[0];
}

interface bOrderItem {
    count: number,
    cartItem?: CartItem,
    order?: Order
}

export const BuildOrderItem = (params: bOrderItem): any => {
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

interface bOrder {
    count: number
    orderItems?: OrderItem[]
}

export const BuildOrder = (params: bOrder): any => {
    let orders: Order[] = [];

    for (let x: number = 1; x <= params.count; x ++) {
        orders.push(
            new Order(
                x,
                1,
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

interface bBuildMenuItem {
    count: number,
    name?: string,
    spicy?: boolean,
    proteins?: string
}

export const BuildMenuItem = (params: bBuildMenuItem): any => {
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