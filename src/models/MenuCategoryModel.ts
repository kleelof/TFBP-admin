import ModelBase from "./ModelBase";
import MenuCategoryItem from "./MenuCategoryItemModel";

export class MenuCategory extends ModelBase {
    public name!: string;
    public index!: number;
    public enabled!: boolean;
    public items!: MenuCategoryItem[]

    constructor(
        name: string = '',
        index: number = 0,
        enabled: boolean = true,
        items: MenuCategoryItem[] = []
    ) {
        super();

        this.name = name;
        this.index = index;
        this.enabled = enabled;
        this.items = items;
    }
}