import ModelBase from "./ModelBase";
import Zone from "./ZoneModel";

export default class Zipcode extends ModelBase {

    public code!: string;
    public zone!: Zone | number;

    constructor(id?: number, code?: string, zone?: Zone | number) {
        super();

        this.id = id || -1;
        this.code = code || '';
        this.zone = zone || new Zone();
    }
}