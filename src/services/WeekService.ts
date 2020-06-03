import Service from './Service';
import WeekMenuItemDTO from '../dto/WeekMenuItemDTO';

class WeekService extends Service {
    appName = "admin_app";
    view = "week";

    public attachWeekMenuItem(weekID: number, menuItemID: number, attach: boolean = true): Promise<WeekMenuItemDTO> {
        console.log(weekID, menuItemID);
        return this._get<WeekMenuItemDTO>(`${this.appName}/${this.view}/attach_week_menu_item?week=${weekID}/${menuItemID}/${attach === true? '1': '0'}`)
    }
}

export default new WeekService();