import ModelBase from "./ModelBase";
import {MenuCategory} from "./MenuCategoryModel";
import DeliveryDayItem from "./DeliveryDayItemModel";

export default class DeliveryDayMenuCategory extends ModelBase {
    public menu_category!: MenuCategory;
    public index!: number;
    public delivery_day_items!: DeliveryDayItem[]
}