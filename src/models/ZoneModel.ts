import ModelBase from './ModelBase';
import Zipcode from "./ZipcodeModel";

export default class Zone extends ModelBase {

    public name!: string;
    public zip_codes!: Zipcode[];

    public jdel_min!: number;
    public jdel_del_charge!: number;
    public jdel_free_del_min!: number;
    public jdel_tax!: number;

    public fdel_min!: number;
    public fdel_del_charge!: number;
    public fdel_free_del_min!: number;
    public fdel_tax!: number;

    public ship_min!: number;
    public ship_del_charge!: number;
    public ship_free_del_min!: number;
    public ship_tax!: number;

    constructor(
        id: number = -1,
        name: string = '',
        zip_codes: Zipcode[] = []
    ) {
        super();
        this.id = id;
        this.name = name;
        this.zip_codes = zip_codes;
    }
}