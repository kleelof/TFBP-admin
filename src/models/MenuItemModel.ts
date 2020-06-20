import ModelBase from "./ModelBaseModel";

export default class MenuItem extends ModelBase {

    public name: string = "";
    public description: string = "";
    public proteins: string = "";
    public allergens: string = "";
    public price: number = 0;
    public image!: File | string | null;
    public spicy: boolean = false;
    public category: string = 'en';
}

export class MenuItemDTO {

    public id!: number;
    public name: string = "";
    public description: string = "";
    public proteins: string = "";
    public allergens: string = "";
    public price: number = 0;
    public image!: File | string | null;
    public active!: boolean;
    public spicy: boolean = false;
    public category: string = 'en';
}