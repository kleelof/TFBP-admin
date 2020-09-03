import OrderItem from '../src/models/OrderItemModel';
import Order from '../src/models/OrderModel';
import CartItem from '../src/models/CartItemModel';
import { BuildCartItem } from './cartMocks';
import MenuItem from "../src/models/MenuItemModel";
import Coupon from "../src/models/Coupon";
import MailTemplate from "../src/models/MailTemplate";
import Newsletter from "../src/models/Newsletter";

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

interface IOrderItem {
    count: number,
    cartItem?: CartItem,
    order?: Order
}

export const BuildOrderItem = (params: IOrderItem): any => {
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
                1,
                `contact_name_${x}`,
                `000-000-000${x}`,
                `email_${x}@email.com`,
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

interface IBuildMailTemplate {
    count: number;
    options?: {}
}

export const BuildMailTemplate = (params: IBuildMailTemplate): any => {
    let items: MailTemplate[] = [];

    for (let x: number = 1; x <= params.count; x ++){
        items.push(
            new MailTemplate(
                `template-slug-${x}`,
                `template text ${x}`,
                params.options || {}
            )
        )
    }

    return items.length> 1 ? items : items[0];
}

interface IBuildMenuItem {
    count: number,
    name?: string,
    spicy?: boolean,
    proteins?: string
}

export const BuildMenuItem = (params: IBuildMenuItem): any => {
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

interface IBuildNewsletter {
    count: number,
    title?: string,
    content?: string,
    release_date?: any
}

export const BuildNewsletter = (params: IBuildNewsletter):any => {
    let items: Newsletter[] = [];

    for (let x: number = 1; x <= params.count; x ++) {
        items.push(
            new Newsletter(
                x,
                params.title || `newsletter_title_${x}`,
                params.content || 'Newsletter Content',
                params.release_date || null
            )
        )
    }

    return items.length > 1 ? items : items[0];
}