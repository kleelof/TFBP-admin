import Service from './Service';
import WeekMenuItemDTO from '../dto/WeekMenuItemDTO';
import DeliveryDay from '../models/DeliveryDayModel';

class DeliveryDayService extends Service {
    appName = "admin_app";
    view = "delivery_day";

    public attachWeekMenuItem(weekID: number, menuItemID: number, attach: boolean = true): Promise<WeekMenuItemDTO> {
        console.log(weekID, menuItemID);
        return this._get<WeekMenuItemDTO>(`${this.appName}/${this.view}/attach_week_menu_item?week=${weekID}/${menuItemID}/${attach === true? '1': '0'}`)
    }

    public duplicateDeliveryDay = (deliveryDay: DeliveryDay, date: string): Promise<DeliveryDay> => {
        return this._get<DeliveryDay>(`${this.appName}/${this.view}/duplicate/${deliveryDay.id}/${date}/`)
    } 
}

export default new DeliveryDayService();