import ModelBase from './ModelBase';
import MenuItem from './MenuItemModel';
import DeliveryDay from './DeliveryDayModel';
import DeliveryMenuCategory from "./DeliveryMenuCategoryModel";

export class DeliveryDayItemDTO extends ModelBase {
    public sold_out: boolean = false;
    public price: number = 0;
    public menu_item!: number;
    public delivery_day!: number;
    public delivery_category!: DeliveryMenuCategory;

    constructor(delivery_day: number, menu_item: number, sold_out: boolean, price: number) {
        super();
        this.delivery_day = delivery_day;
        this.menu_item = menu_item;
        this.sold_out = sold_out;
        this.price = price;
    }
}

export default class DeliveryDayItem extends ModelBase {

    public sold_out: boolean = false;
    public price: number = 0;
    public menu_item!: MenuItem;
    public delivery_day!: DeliveryDay;
    public delivery_category!: DeliveryMenuCategory

    constructor(delivery_day?: DeliveryDay, menu_item?: any, sold_out?: boolean, price?: number) {
        super();

        this.delivery_day = delivery_day || new DeliveryDay();
        this.menu_item = menu_item || new MenuItem();
        this.sold_out = sold_out || false;
        this.price = price || 0;
    }

    public getDTOxxx = (): DeliveryDayItemDTO => {
        return new DeliveryDayItemDTO(this.delivery_day.id, this.menu_item.id, this.sold_out, this.price);
    }
}