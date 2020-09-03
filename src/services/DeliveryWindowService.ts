import Service from './Service';
import {DeliveryWindowWithCountsDTO} from "../models/DeliveryWindowModel";
import Order from "../models/OrderModel";
import helpers from "../helpers/helpers";

class DeliveryWindowService extends Service {
    appName = 'dashboard';
    view = 'delivery_window';

    public listWithCounts = (targetDate: Date): Promise<DeliveryWindowWithCountsDTO[]> => {
        return this._get(`${this.appName}/${this.view}/list_with_counts/?target_date=${helpers.dateToShortISO(targetDate)}`);
    }

    public retrieveOrders = (deliveryWindowId: number, targetDate: Date): Promise<Order[]> => {
        return this._get(`${this.appName}/${this.view}/${deliveryWindowId}/retrieve_orders/?target_date=${helpers.dateToShortISO(targetDate)}`)
    }
}

export default new DeliveryWindowService()