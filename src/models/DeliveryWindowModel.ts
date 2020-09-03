import ModelBase from "./ModelBase";

export class DeliveryWindowDTO {
    public date!: string;
    public window!: DeliveryWindow};

export default class DeliveryWindow extends ModelBase {

    public name!: string;
    public start_time!: string;
    public end_time!: string;
    public day!:number; // 0 = Monday

    constructor(id?: number, name?: string, start_time?: string, end_time?: string, day?: number) {
        super();
        this.name = name || 'delivery_window';
        this.start_time = start_time || "11:00:00";
        this.end_time = end_time || "13:00:00";
        this.day = day || 0;
        this.id = id || -1;
    }
}

export class DeliveryWindowWithCountsDTO {
    public dish_count!: number;
    public order_count!: number;
    public window!: DeliveryWindow;
}