import ModelBase from "./ModelBase";
import OrderItem from "./OrderItemModel";

export default class Order extends ModelBase {

    public contact_name!: string;
    public phone_number!: string;
    public email!: string;
    public unit!: string;
    public street_address!: string;
    public city!: string;
    public zip!: string;
    public items!: OrderItem[];
    public order_status!: number;
    public notes!: string;
    public public_id!: string;
    public square_payment!: {};
}

export class OrderDTO extends ModelBase {

    public contact_name!: string;
    public phone_number!: string;
    public email!: string;
    public unit!: string;
    public street_address!: string;
    public city!: string;
    public zip!: string;
    public order_status!: number;
    public notes!: string;

    constructor(order: Order) {
        super();

        this.contact_name = order.contact_name;
        this.phone_number = order.phone_number;
        this.email = order.email;
        this.unit = order.unit;
        this.street_address = order.street_address;
        this.city = order.city;
        this.zip = order.zip;
        this.order_status = order.order_status;
        this.notes = order.notes;
    }
}