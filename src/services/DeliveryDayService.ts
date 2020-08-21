import Service from './Service';
import WeekMenuItemDTO from '../dto/WeekMenuItemDTO';
import DeliveryDay from '../models/DeliveryDayModel';
import DeliveryWindow from '../models/DeliveryWindowModel';

class DeliveryDayService extends Service {
    appName = "dashboard";
    view = "delivery_day";

    public attachWeekMenuItem(weekID: number, menuItemID: number, attach: boolean = true): Promise<WeekMenuItemDTO> {
        console.log(weekID, menuItemID);
        return this._get<WeekMenuItemDTO>(`${this.appName}/${this.view}/attach_week_menu_item?week=${weekID}/${menuItemID}/${attach === true? '1': '0'}`)
    }

    public attachDeliveryWindow = (day: DeliveryDay, window: DeliveryWindow): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/attach_delivery_window/${day.id}/${window.id}/`)
    }

    public detachDeliveryWindow = (day: DeliveryDay, window: DeliveryWindow): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/detach_delivery_window/${day.id}/${window.id}/`)
    }

    public duplicateDeliveryDay = (deliveryDay: DeliveryDay, start_date: string, end_date: string): Promise<DeliveryDay> => {
        return this._get<DeliveryDay>(`${this.appName}/${this.view}/duplicate/?date=${start_date}&end_date=${end_date}&delivery_day=${deliveryDay.id}`);
    }
}

export default new DeliveryDayService();