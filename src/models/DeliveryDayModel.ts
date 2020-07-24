import DeliveryDayItem from "./DeliveryDayItemModel";
import ModelBase from "./ModelBaseModel";

export default class DeliveryDay extends ModelBase {

    public date!: string;
    public day_items!: DeliveryDayItem[]
    public delivery_windows: number[] = []

    constructor(date: string) {
        super();
        this.date = date;
    }
}