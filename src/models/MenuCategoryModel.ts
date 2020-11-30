import ModelBase from "./ModelBase";
import MenuItem from "./MenuItemModel";

export class MenuCategory extends ModelBase {
    public name!: string;
    public index!: number;
    public enabled!: boolean;
    public menu_items!: MenuItem[]

    constructor(
        name: string = '',
        index: number = 0,
        enabled: boolean = true,
        menu_items: MenuItem[] = []
    ) {
        super();

        this.name = name;
        this.index = index;
        this.enabled = enabled;
        this.menu_items = menu_items;
    }
}