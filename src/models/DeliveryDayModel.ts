import DeliveryDayItem from "./DeliveryDayItemModel";
import ModelBase from "./ModelBase";
import { DeliveryWindowDTO } from "./DeliveryWindowModel";
import DeliveryDayMenuCategory from "./DeliveryDayMenuCategory";

export default class DeliveryDay extends ModelBase {

    public date!: string;
    public end_date!: string;
    public day_items!: DeliveryDayItem[];
    public is_perpetual!: boolean;
    public is_active!: boolean;
    public name!: string;
    public categories!: DeliveryDayMenuCategory[];

    constructor(
        date?: string,
        id?: number,
        end_date?: string,
        day_items?: DeliveryDayItem[],
        is_perpetual: boolean = false,
        name: string = '') {
            super();

            this.id = id || -1;
            this.date = date || '';
            this.end_date = end_date || '';
            this.day_items = day_items || [];
            this.is_perpetual = is_perpetual;
            this.name = name;
    }
}

export class DeliveryDayDTO  {
    public delivery_day: DeliveryDay = new DeliveryDay();
    public windows: DeliveryWindowDTO[] = [];
};

export type DeliveryDaysDTO = {zip_valid: boolean, delivery_days: DeliveryDay[]} 