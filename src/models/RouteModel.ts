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
}