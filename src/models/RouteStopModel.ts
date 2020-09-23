import ModelBase from "./ModelBase";
import Order from "./OrderModel";

export default class RouteStop extends ModelBase {
    public delivered_at!: string;
    public index!: number;
    public leg!: any;
    public order!: Order;
    public current_index!: number;
    public stop_status!: number;

    /*
    STOP_STATUS = (
    (0, 'queued'),
    (1, 'en_route'),
    (3, 'at_stop'),
    (4, 'completed'),
    (5, 'canceled')
)
     */

    constructor(
        id?: number,
        delivered_at?: string,
        index?: number,
        leg?: any,
        order?: Order,
        current_index?: number,
        stop_status?: number,
    )
    {
        super();
        this.id = id || -1;
        this.delivered_at = delivered_at || '';
        this.index = index || -1;
        this.leg = leg || '';
        this.order = order || new Order();
        this.current_index = current_index || -1;
        this.stop_status = stop_status || 0;
    }
}