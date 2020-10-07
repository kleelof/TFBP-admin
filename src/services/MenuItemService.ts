import Service from './Service';
import MenuItem from '../models/MenuItemModel';

class MenuItemService extends Service {
    appName = "dashboard";
    view = "menu_item";
}

export default new MenuItemService();