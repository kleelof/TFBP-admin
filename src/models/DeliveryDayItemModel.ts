import ModelBase from './ModelBaseModel';
import MenuItem from './MenuItemModel';
import DeliveryDay from './DeliveryDayModel';

export class DeliveryDayItemDTO extends ModelBase {
    public sold_out: boolean = false;
    public price: number = 0;
    public menu_item!: number;
    public delivery_day!: number;

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

    constructor(delivery_day: DeliveryDay, menu_item: MenuItem, sold_out: boolean, price: number) {
        super();
        this.delivery_day = delivery_day;
        this.menu_item = menu_item;
        this.sold_out = sold_out;
        this.price = price;
        
    }

    public getDTO = (): DeliveryDayItemDTO => {
        return new DeliveryDayItemDTO(this.delivery_day.id, this.menu_item.id, this.sold_out, this.price);
    }
}