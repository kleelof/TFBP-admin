import ModelBase from "./ModelBase";
import DeliveryWindow from "./DeliveryWindowModel";
import Order from "./OrderModel";

export default class Route extends ModelBase {
    public delivered!: string;
    public delivery_date!: string;
    public delivery_window!: DeliveryWindow;
    public index!: number;
    public leg!: any;
    public order!: Order;

    constructor(
        id?: number,
        delivered?: string,
        delivery_date?: string,
        index?: number,
        leg?: any,
        order?: Order)
    {
        super();
        this.id = id || -1;
        this.delivered = delivered || '';
        this.delivery_date = delivery_date || '';
        this.index = index || -1;
        this.leg = leg || '';
        this.order = order || new Order();
    }
}