import ModelBase from './ModelBase';
import Zipcode from "./ZipcodeModel";

export default class Zone extends ModelBase {

    public name!: string;
    public zip_codes!: Zipcode[]

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