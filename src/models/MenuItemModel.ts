import ModelBase from "./ModelBaseModel";

export default class MenuItem extends ModelBase {

    public name: string = "";
    public description: string = "";
    public proteins: string = "";
    public allergens: string = "";
    public price: number = 0;
    public image!: File | string | null;
    public spicy!: boolean;
}