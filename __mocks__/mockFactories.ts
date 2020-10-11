import OrderItem from '../src/models/OrderItemModel';
import Order from '../src/models/OrderModel';
import CartItem from '../src/models/CartItemModel';
import { BuildCartItem } from './cartMocks';
import MenuItem from "../src/models/MenuItemModel";
import Coupon from "../src/models/CouponModel";
import MailTemplate from "../src/models/MailTemplate";
import Newsletter from "../src/models/Newsletter";
import MailingListModel from "../src/models/MailingListModel";
import Zipcode from "../src/models/ZipcodeModel";
import Zone from "../src/models/ZoneModel";
import Route from "../src/models/RouteModel";
import DeliveryWindow from "../src/models/DeliveryWindowModel";
import RouteStop from "../src/models/RouteStopModel";
import {BuildDeliveryWindow} from "./deliveryMocks";
import PagedResultsDTO from "../src/dto/PagedResultsDTO";
import ModelBase from "../src/models/ModelBase";

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
                `street_address_${x}`,
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
                params.content || 'Newsletter Content newsletter__email_title  newsletter__email_content',
                params.release_date || null
            )
        )
    }

    return items.length > 1 ? items : items[0];
}

interface IBuildMailingListEntry {
    count: number,
    code?: string,
    email?: string,
    active?: boolean
}

export const BuildMailingList = (params: IBuildMailingListEntry): any => {
    let items: MailingListModel[] = [];

    for (let x: number =1; x <= params.count; x ++) {
        items.push(
            new MailingListModel(
                x,
                params.email || `email_${x}@mail.com`,
                params.code || x.toString(),
                params.active || true
            )
        )
    }

    return items.length > 1 ? items : items[0];
}

interface IBuildRoute {
    count: number,
    optimized?: boolean,
    delivery_date?: string,
    delivery_window?: DeliveryWindow,
    stops?: RouteStop[],
    route_status?: number
}

export const BuildRoute = (params: IBuildRoute): any => {
    let items: Route[] = [];

    for (let x: number = 1; x <= params.count; x ++) {
        items.push(
            new Route(
                x,
                params.delivery_date || `2020-07-0${x}`,
                params.delivery_window || BuildDeliveryWindow({count: 1}),
                params.stops || BuildRouteStop({count: 2}),
                params.route_status || 0
            )
        )
    }

    return items.length > 1 ? items : items[0];
}

interface IBuildRouteStop {
    count: number,
    delivered?: string,
    index?: number,
    leg?: any,
    order?: Order
    stop_status?: number
}

export const BuildRouteStop = (params: IBuildRouteStop): any => {
    let items: RouteStop[] = [];

    for (let x: number = 1; x <= params.count; x ++) {
        items.push(
            new RouteStop(
                x,
                params.delivered || '2020-07-04',
                params.index || x,
                params.leg || JSON.stringify({
                    end_location: {
                        lat: 0,
                        lng: 0
                    },
                    distance: {
                        text: '1 mile'
                    },
                    duration: {
                        text: '5 minutes'
                    }
                }),
                params.order || BuildOrder({count: 1}),
                params.index || x,
                params.stop_status || 0
            )
        )
    }

    return items.length > 1 ? items : items[0];
}

interface IBuildSearchResultsDTO {
    count: number,
    results: ModelBase[]
}

export const BuildSearchResultsDTO = (params: IBuildSearchResultsDTO): PagedResultsDTO => {
    return new PagedResultsDTO(params.count, params.results);
}

interface IBuildZone {
    count: number,
    name?: string,
    zip_codes?: Zipcode[]
}

export const BuildZone = (params: IBuildZone): any =>  {
    let items: Zone[] = [];

    for (let x: number =1; x <= params.count; x ++) {
        items.push(
            new Zone(
                x,
                params.name || `zone_${x}`,
                params.zip_codes || []
            )
        )
    }

    return items.length > 1 ? items: items[0];
}

interface IBuildZipcode {
    count: number,
    code?: string,
    zone?: Zone
}

export const BuildZipcode = (params: IBuildZipcode): any => {
    let items: Zipcode[] = [];

    for (let x: number = 1; x <= params.count; x ++) {
        items.push(
            new Zipcode(
                x,
                params.code || x.toString(),
                params.zone || BuildZone({count: 1})
            )
        )
    }

    return items.length > 1 ? items : items[0];
}