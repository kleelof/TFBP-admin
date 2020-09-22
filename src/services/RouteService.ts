import Service from "./Service";
import Route from "../models/RouteModel";

class RouteService extends Service {
    appName = 'dashboard';
    view = 'route';

    public reorderAndRecalculate = (route: Route, ndxs: number[]): Promise<Route> => {
        return this._post(`${this.appName}/${this.view}/${route.id}/reorder_and_recalculate/`, {
            ndxs: JSON.stringify(ndxs)
        })
    }
}

export default new RouteService();