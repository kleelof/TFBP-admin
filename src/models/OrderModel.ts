import ModelBase from "./ModelBase";
import OrderItem from "./OrderItemModel";

export default class Order extends ModelBase {

    public contact_name!: string;
    public phone_number!: string;
    public email!: string;
    public unit!: string;
    public street_address!: string;
    public city!: string;
    public zip!: string;
    public items!: OrderItem[];
}

export class OrderDTO extends ModelBase {

    public contact_name!: string;
    public phone_number!: string;
    public email!: string;
    public unit!: string;
    public street_address!: string;
    public city!: string;
    public zip!: string;

    constructor(contact_name: string, phone_number: string, email: string, unit: string,
                street_address: string, city: string, zip: string) {
                    super();

                    this.contact_name = contact_name;
                    this.phone_number = phone_number;
                    this.email = email;
                    this.unit = unit;
                    this.street_address = street_address;
                    this.city = city;
                    this.zip = zip;
                }
}