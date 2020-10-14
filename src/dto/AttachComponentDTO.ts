/*
    For attaching components/addons to menu items
 */

export default class AttachComponentDTO {
    public item_type!: string; // 'recipe', 'ingredient'
    public item_id!: number;
    public component_quantity!: number;
    public component_unit!: number;
    public is_add_on!: boolean;
    public add_on_name!: string;
    public add_on_price!: number;

    constructor(
        item_type: string,
        item_id: number,
        component_quantity: number = 0,
        component_unit: number = 0,
        is_add_on: boolean = false,
        add_on_name: string = '',
        add_on_price: number = 0
    ) {
        this.item_type = item_type;
        this.item_id = item_id;
        this.component_quantity =component_quantity;
        this.component_unit =component_unit;
        this.is_add_on = is_add_on;
        this.add_on_name = add_on_name;
        this.add_on_price = add_on_price;
    }
}