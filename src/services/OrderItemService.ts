import Service from './Service';
import OrderItem from '../models/OrderItemModel';

class OrderItemService extends Service{

    appName = 'operator_app';
    view = 'order_item';

    public getCompleted = (date: string): Promise<OrderItem[]> => {
        return this._get<OrderItem[]>(`${this.appName}/${this.view}/get_completed/?date=${date}`)
    }
}

export default new OrderItemService();