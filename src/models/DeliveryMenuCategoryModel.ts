import ModelBase from "./ModelBase";
import DeliveryDay from "./DeliveryDayModel";
import {MenuCategory} from "./MenuCategoryModel";

export default class DeliveryMenuCategory extends ModelBase {

    public delivery_day!: DeliveryDay;
    public menu_category!: MenuCategory;
    public index!: number;
}