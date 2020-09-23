import Service from "./Service";
import Route from "../models/RouteModel";

class RouteService extends Service {
    appName = 'dashboard';
    view = 'route';

    public commitRoute = (route: Route): Promise<Route> => {
        return this._get(`${this.appName}/${this.view}/${route.id}/commit`);
    }

    public completeRoute = (route: Route): Promise<Route> => {
        return this._get(`${this.appName}/${this.view}/${route.id}/complete_route`);
    }

    public startRoute = (route: Route): Promise<Route> => {
        return this._get(`${this.appName}/${this.view}/${route.id}/start_route`);
    }

    public updateStopOrder = (route: Route, stopIds: number[]): Promise<Route> => {
        return this._post(`${this.appName}/${this.view}/${route.id}/update_stop_order/`, {
            stop_ids: JSON.stringify(stopIds)
        })
    }
}

export default new RouteService();