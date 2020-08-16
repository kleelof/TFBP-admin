import ModelBase from './ModelBase';
import {format} from 'date-fns';

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
        id?: number,
        code?: string,
        active?: boolean,
        mode?: number,
        expire?: string,
        start_value?: number,
        current_value?: number,
        remaining_uses?: number,
        email?: string
    ){
        super();
        let expire_date: Date = new Date();
        expire_date.setDate(expire_date.getDate() + 60); // an extra 30 days  to cover for the diff between python and javascript dates
        this.id = id || -1;
        this.code = code || '';
        this.active = active !== false ? true : false;
        this.mode = mode || 0;
        this.expire = expire ||
            format(expire_date, 'yyyy-mm-dd');
        this.start_value = start_value || 0;
        this.current_value = current_value || 0;
        this.remaining_uses = remaining_uses || 0;
        this.email = email || '';
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