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
}