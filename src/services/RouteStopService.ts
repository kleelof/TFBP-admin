import Service from "./Service";
import RouteStop from "../models/RouteStopModel";
import Route from "../models/RouteModel";

class RouteStopService extends Service {
    appName = 'dashboard';
    view = 'route_stop';

    public alertDelivery = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/delivery_alert/`);
    }

    public delivered = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/delivered/`);
    }
}

export default new RouteStopService();