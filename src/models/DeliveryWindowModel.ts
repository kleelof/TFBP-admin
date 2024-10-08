import ModelBase from "./ModelBase";
import Zone from "./ZoneModel";

export const DELIVERY_WINDOW_TYPES = {
    'standard': 0,
    'pickup': 1,
    'delivery': 2,
    'futureDelivery': 3
}

export class DeliveryWindowDTO {
    public date!: string;
    public window!: DeliveryWindow};

export default class DeliveryWindow extends ModelBase {

    public name!: string;
    public active!: boolean;
    public start_time!: string;
    public end_time!: string;
    public day!:number; // 0 = Monday
    public start_date: string | null;
    public end_date!: string | null;
    public zones!: Zone[];
    public type!: number;

    constructor(id?: number, name?: string, start_time?: string, end_time?: string, day?: number, active?: boolean,
                start_date?: string | null, end_date?: string | null, type: number = 0) {
        super();
        this.name = name || '';
        this.start_time = start_time || "1";
        this.end_time = end_time || "";
        this.day = day || 0;
        this.id = id || -1;
        this.active = active === undefined ? false : active;
        this.start_date = start_date || null;
        this.end_date = end_date || null;
        this.type = type;
    }
}

export class DeliveryWindowWithCountsDTO {
    public dish_count!: number;
    public order_count!: number;
    public window!: DeliveryWindow;
}