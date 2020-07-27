import ModelBase from './ModelBase';

export default class Coupon extends ModelBase {

    public code!: string;
    public mode!: number;
    public expire!: string;
    public start_value!: number;
    public current_value!: number;
    public remaining_uses!: number;
    public email!: string;
    public active!: boolean;

    constructor (
        id: number = -1,
        active: boolean = false,
        mode: number = 0,
        expire: string = "2020-07-04",
        start_value: number = 0,
        current_value: number = 0,
        remaining_uses: number = 0,
        email: string = ""
    ){
        super();
        this.id = id;
        this.active = active;
        this.mode = mode;
        this.expire = expire;
        this.start_value = start_value;
        this.current_value = current_value;
        this.remaining_uses = remaining_uses;
        this.email = email;
    }
}

export class CouponDTO extends Coupon {

    public code!: string;
    public mode!: number;
    public expire!: string;
    public start_value!: number;
    public current_value!: number;
    public remaining_uses!: number;
    public email!: string;
    public active!: boolean;

    constructor(coupon: Coupon){
        super();
        this.id = coupon.id;
        this.active = coupon.active;
        this.mode = coupon.mode;
        this.expire = coupon.expire;
        this.start_value = coupon.start_value;
        this.current_value = coupon.current_value;
        this.remaining_uses = coupon.remaining_uses;
        this.email = coupon.email;
    }
}