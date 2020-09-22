import Service from "./Service";
import RouteStop from "../models/RouteStopModel";
import Route from "../models/RouteModel";

class RouteStopService extends Service {
    appName = 'dashboard';
    view = 'route_stop';

    public alertDelivery = (routeId: number): Promise<RouteStop> => {
            return this._get(`${this.appName}/${this.view}/${routeId}/delivery_alert/`);
    }
}

export default new RouteStopService();