import Service from './Service';
import MenuItem from '../models/MenuItemModel';

class MenuItemService extends Service {
    appName = "dashboard";
    view = "menu_item";

    public loadByCategory = (category: string): Promise<MenuItem[]> => {
        return this._get(`${this.appName}/${this.view}/?category=${category}`);
    }
}

export default new MenuItemService();