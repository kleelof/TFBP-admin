import ModelBase from "./ModelBase";
import DeliveryWindow from "./DeliveryWindowModel";
import RouteStop from "./RouteStopModel";

export default class Route extends ModelBase {
    public optimized!: boolean;
    public delivery_date!: string;
    public delivery_window!: DeliveryWindow
    public stops!: RouteStop[];
    public route_status!: number;

    /*
    ROUTE_STATUS = (
    (0, "uncommitted"),
    (1, "committed"),
    (2, "in_progress"),
    (3, "completed")
)
     */

    constructor(
        id?: number,
        delivery_date?: string,
        delivery_window?: DeliveryWindow,
        stops?: RouteStop[],
        optimized?: boolean,
        route_status?: number
    )
    {
        super();
        this.id = id || -1;
        this.delivery_date = delivery_date || '';
        this.delivery_window = delivery_window || new DeliveryWindow();
        this.stops = stops || [];
        this.optimized = optimized || false;
        this.route_status = route_status || 0;
    }
}