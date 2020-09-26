import ModelBase from "./ModelBase";
import DeliveryWindow from "./DeliveryWindowModel";
import RouteStop from "./RouteStopModel";

export default class Route extends ModelBase {
    public delivery_date!: string;
    public delivery_window!: DeliveryWindow
    public stops!: RouteStop[];
    public route_status!: number;
    public started_at!: string;
    public finished_at!: string;

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
        route_status?: number,
        started_at?: string,
        finished_at?: string
    )
    {
        super();
        this.id = id || -1;
        this.delivery_date = delivery_date || '';
        this.delivery_window = delivery_window || new DeliveryWindow();
        this.stops = stops || [];
        this.route_status = route_status || 0;
        this.started_at = started_at || '';
        this.finished_at = finished_at || '';
    }
}