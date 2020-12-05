import Service from './Service';
import DeliveryDay from '../models/DeliveryDayModel';
import DeliveryWindow from '../models/DeliveryWindowModel';
import {MenuCategory} from "../models/MenuCategoryModel";
import DeliveryDayMenuCategory from "../models/DeliveryDayMenuCategory";

class DeliveryDayService extends Service {
    appName = "dashboard";
    view = "delivery_day";

    public attachCategory = (deliveryDay: DeliveryDay, category: MenuCategory | string): Promise<DeliveryDayMenuCategory> => {
        return this._post(`${this.viewPath}/${deliveryDay.id}/attach_category/`, {
            category: typeof category === 'string' ? category : category.id
        })
    }

    //TODO: May be deprecated
    public attachDeliveryWindow = (day: DeliveryDay, window: DeliveryWindow): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/c/${day.id}/${window.id}/`)
    }

    //TODO: May be deprecated
    public detachDeliveryWindow = (day: DeliveryDay, window: DeliveryWindow): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/detach_delivery_window/${day.id}/${window.id}/`)
    }

    public duplicateDeliveryDay = (deliveryDay: DeliveryDay, start_date: string, end_date: string): Promise<DeliveryDay> => {
        return this._get<DeliveryDay>(`${this.appName}/${this.view}/duplicate/?date=${start_date}&end_date=${end_date}&delivery_day=${deliveryDay.id}`);
    }
}

export default new DeliveryDayService();