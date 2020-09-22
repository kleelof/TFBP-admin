import Service from './Service';
import {DeliveryWindowWithCountsDTO} from "../models/DeliveryWindowModel";
import Order from "../models/OrderModel";
import moment from 'moment';
import DeliveryRouteDTO from "../dto/DeliveryRouteDTO";
import Route from "../models/RouteModel";

class DeliveryWindowService extends Service {
    appName = 'dashboard';
    view = 'delivery_window';

    public listWithCounts = (targetDate: string): Promise<DeliveryWindowWithCountsDTO[]> => {
        return this._get(`${this.appName}/${this.view}/list_with_counts/?target_date=${targetDate}`);
    }

    public retrieveOrders = (deliveryWindowId: number, targetDate: Date): Promise<Order[]> => {
        return this._get(`${this.appName}/${this.view}/${deliveryWindowId}/retrieve_orders/?target_date=${
            moment(targetDate).utc().format('YYYY-MM-DD')}`)
    }

    public retrieveRoute = (deliveryWindowId: number, targetDate: Date, optimize: boolean): Promise<Route> => {
        return this._get(`${this.appName}/${this.view}/${deliveryWindowId}/retrieve_route/?target_date=${
            moment(targetDate).utc().format('YYYY-MM-DD')}&optimize=${optimize.toString()}`)
    }

    public addZone = (deliveryWindowId: number, zoneId: number): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/add_zone/${deliveryWindowId}/${zoneId}/`);
    }

    public removeZone = (deliveryWindowId: number, zoneId: number): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/remove_zone/${deliveryWindowId}/${zoneId}/`);
    }
}

export default new DeliveryWindowService()