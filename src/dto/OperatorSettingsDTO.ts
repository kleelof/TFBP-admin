
export default class OperatorSettingsDTO {
    public id!: number;
    public delivery_fee!: number;
    public free_delivery_minimum!: number
    public delivery_minimum!: number
    public tax_rate!: number
    public tax_tips!: boolean;
    public tax_delivery_fee!: boolean;
    public customer_must_be_present!: boolean;
    public allow_tipping!: boolean;
    public type!: number;

    constructor(
        id: number = -1,
        delivery_fee: number = 5,
        free_delivery_minimum: number = 25,
        delivery_minimum: number = 10,
        tax_rate: number = 0,
        tax_tips: boolean = false,
        tax_delivery_fee: boolean = false,
        customer_must_be_present: boolean = true,
        allow_tipping: boolean = true,
        type: number = 0
    ) {
        this.id = id;
        this.delivery_fee = delivery_fee;
        this.free_delivery_minimum = free_delivery_minimum;
        this.delivery_minimum = delivery_minimum;
        this.tax_rate = tax_rate;
        this.tax_tips = tax_tips;
        this.tax_delivery_fee = tax_delivery_fee;
        this.customer_must_be_present = customer_must_be_present;
        this.allow_tipping = allow_tipping;
        this.type = type;
    }
}