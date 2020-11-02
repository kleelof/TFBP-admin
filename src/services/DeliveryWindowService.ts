import Service from './Service';
import {DeliveryWindowWithCountsDTO} from "../models/DeliveryWindowModel";
import Order from "../models/OrderModel";
import moment from 'moment';
import DeliveryRouteDTO from "../dto/DeliveryRouteDTO";
import Route from "../models/RouteModel";
import MomentHelper from "../helpers/MomentHelper";
import momentHelper from "../helpers/MomentHelper";

class DeliveryWindowService extends Service {
    appName = 'dashboard';
    view = 'delivery_window';

    public generateProductionBoard = (windowId: number, date: Date): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/${windowId}/generate_production_board_pdf/?target_date=${momentHelper.asDateSlug(date, true)}`);
    }

    public generateDeliveryTags = (windowId: number, date: Date): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/${windowId}/generate_delivery_tags_pdf/?target_date=${momentHelper.asDateSlug(date, true)}`);
    }

    public listWithCounts = (targetDate: string): Promise<DeliveryWindowWithCountsDTO[]> => {
        return this._get(`${this.appName}/${this.view}/list_with_counts/?target_date=${targetDate}`);
    }

    public retrieveOrders = (deliveryWindowId: number, targetDate: Date): Promise<Order[]> => {
        return this._get(`${this.appName}/${this.view}/${deliveryWindowId}/retrieve_orders/?target_date=${
            moment(targetDate).utc().format('YYYY-MM-DD')}`)
    }

    public retrieveRoute = (deliveryWindowId: number, targetDate: Date): Promise<Route> => {
        return this._get(`${this.appName}/${this.view}/${deliveryWindowId}/retrieve_route/?target_date=${
            moment(targetDate).utc().format('YYYY-MM-DD')}`)
    }

    public addZone = (deliveryWindowId: number, zoneId: number): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/add_zone/${deliveryWindowId}/${zoneId}/`);
    }

    public removeZone = (deliveryWindowId: number, zoneId: number): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/remove_zone/${deliveryWindowId}/${zoneId}/`);
    }
}

export default new DeliveryWindowService()