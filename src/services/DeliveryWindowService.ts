import Service from './Service';
import {DeliveryWindowWithCountsDTO} from "../models/DeliveryWindowModel";
import Order from "../models/OrderModel";
import moment from 'moment';

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
}

export default new DeliveryWindowService()