import Service from "./Service";
import RouteStop from "../models/RouteStopModel";
import Route from "../models/RouteModel";

class RouteStopService extends Service {
    appName = 'dashboard';
    view = 'route_stop';

    public at_stop = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/at_stop/`);
    }

    public alertDelivery = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/delivery_alert/`);
    }

    public cancel = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/cancel/`);
    }

    public delivered = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/delivered/`);
    }

    public en_route = (stop: RouteStop): Promise<RouteStop> => {
        return this._get(`${this.appName}/${this.view}/${stop.id}/en_route/`);
    }
}

export default new RouteStopService();