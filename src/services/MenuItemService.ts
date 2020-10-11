import Service from './Service';
import MenuItem from '../models/MenuItemModel';
import MenuItemComponent from "../models/MenuItemComponentModel";

class MenuItemService extends Service {
    appName = "dashboard";
    view = "menu_item";

    public getComponents = (menuItem: MenuItem): Promise<MenuItemComponent[]> => {
        return this._get<MenuItemComponent[]>(`${this.appName}/${this.view}/${menuItem.id}/get_components/`);
    }
}

export default new MenuItemService();