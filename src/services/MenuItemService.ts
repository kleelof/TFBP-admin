import Service from './Service';
import MenuItem from '../models/MenuItemModel';
import MenuItemComponent from "../models/MenuItemComponentModel";
import AttachComponentDTO from "../dto/AttachComponentDTO";

class MenuItemService extends Service {
    appName = "dashboard";
    view = "menu_item";

    public attachComponent = (menuItem: MenuItem, dto: AttachComponentDTO): Promise<MenuItemComponent> => {
        return this._post(`${this.appName}/${this.view}/${menuItem.id}/attach_component/`, dto)
    }

    public deleteComponent = (menuItem: MenuItem, componentId: number, isAddon: boolean = false): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/${menuItem.id}/delete_component/?component_id=${componentId}&is_add_on=${isAddon.toString()}`)
    }
}

export default new MenuItemService();