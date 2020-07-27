import ModelBase from "./ModelBase";
import CartItem from "./CartItemModel";
import OrderItem from "./OrderItemModel";

export default class Order extends ModelBase {

    public contact_name!: string;
    public phone_number!: string;
    public email!: string;
    public unit!: string;
    public street_address!: string;
    public city!: string;
    public zip!: string;
    public notes!: string;
    public items!: OrderItem[];
    public uuid!: string;
    public public_id!: string;
    public nonce!: string;
    public tip!:number;

    constructor(
        id: number = -1,
        contact_name: string = '',
        email: string = '',
        unit: string = '',
        street_address: string = '',
        city: string = '',
        zip: string = '',
        notes: string = '',
        items: OrderItem[] = [],
        uuid: string = '',
        public_id: string = '',
        nonce: string = '',
        tip: number = 0
    ){
        super();
        this.id = id;
        this.contact_name = contact_name;
        this.email = email;
        this.unit = unit;
        this.street_address = street_address;
        this.city = city;
        this.zip = zip;
        this.notes = notes;
        this.items = items;
        this.uuid = uuid;
        this.public_id = public_id;
        this.nonce = nonce;
        this.tip = tip;
    }
}

export class OrderDTO extends ModelBase {

    public contact_name!: string;
    public phone_number!: string;
    public email!: string;
    public unit!: string;
    public street_address!: string;
    public city!: string;
    public zip!: string;
    public cart_items!: number[];
    public notes!: string;
    public nonce!: string;
    public tip!: number;
    public coupon!: string;
    
    constructor(contact_name: string, phone_number: string, email: string, unit: string,
                street_address: string, city: string, zip: string, notes: string, nonce: string,
                tip: number, coupon: string, cart_items: CartItem[]) {
                    super();

                    this.contact_name = contact_name;
                    this.phone_number = phone_number;
                    this.email = email;
                    this.unit = unit;
                    this.street_address = street_address;
                    this.city = city;
                    this.zip = zip;
                    this.notes = notes;
                    this.nonce = nonce;
                    this.tip = tip;
                    this.coupon = coupon;
                    this.cart_items = cart_items.map((item: CartItem) => item.id);
                }
}