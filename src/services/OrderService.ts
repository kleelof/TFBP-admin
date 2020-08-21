import Service from './Service';
import Order from '../models/OrderModel';

class OrderService extends Service {
    appName="dashboard";
    view="order";

    public getCompletedOrders = (date: string): Promise<Order[]> => {
        return this._get<Order[]>(`${this.appName}/${this.view}/get_completed/?date=${date}`);
    }
}

export default new OrderService();