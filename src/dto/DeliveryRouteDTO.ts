import ModelBase from "../models/ModelBase";
import Order from "../models/OrderModel";

export default class DeliveryRouteDTO extends ModelBase {

    public response!: any;
    public orders!: Order[];
}