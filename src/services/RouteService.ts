import Service from "./Service";
import Route from "../models/RouteModel";
import DeliveryWindow from "../models/DeliveryWindowModel";
import {stringify} from "querystring";

class RouteService extends Service {
    appName = 'dashboard';
    view = 'route';

    public reorderAndRecalculate = (ndxs: number[], delivery_window: DeliveryWindow, target_date: Date): Promise<Route[]> => {
        return this._post(`${this.appName}/${this.view}/reorder_and_recalculate/`, {
            ndxs: JSON.stringify(ndxs),
            delivery_window,
            target_date
        })
    }
}

export default new RouteService();