import ModelBase from "./ModelBase";
import DeliveryWindow from "./DeliveryWindowModel";
import Order from "./OrderModel";
import RouteStop from "./RouteStopModel";

export default class Route extends ModelBase {
    public optimized!: boolean;
    public delivery_date!: string;
    public delivery_window!: DeliveryWindow
    public stops!: RouteStop[];

    constructor(
        id?: number,
        delivery_date?: string,
        delivery_window?: DeliveryWindow,
        stops?: RouteStop[],
        optimized?: boolean)
    {
        super();
        this.id = id || -1;
        this.delivery_date = delivery_date || '';
        this.delivery_window = delivery_window || new DeliveryWindow();
        this.stops = stops || [];
        this.optimized = optimized || false;
    }
}