import DeliveryDayItem from "./DeliveryDayItemModel";
import ModelBase from "./ModelBase";
import { DeliveryWindowDTO } from "./DeliveryWindowModel";

export default class DeliveryDay extends ModelBase {

    public date!: string;
    public end_date!: string;
    public day_items!: DeliveryDayItem[];
    //public delivery_windows!: DeliveryWindow[];

    constructor(date?: string, id?: number, end_date?: string, day_items?: DeliveryDayItem[]) {
        super();

        this.id = id || -1;
        this.date = date || '';
        this.end_date = end_date || '';
        this.day_items = day_items || []
    }
}

export class DeliveryDayDTO  {
    public delivery_day: DeliveryDay = new DeliveryDay();
    public windows: DeliveryWindowDTO[] = [];
};

export type DeliveryDaysDTO = {zip_valid: boolean, delivery_days: DeliveryDay[]} 