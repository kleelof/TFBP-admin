export default class MenuItemDTO {

    public id!: number;
    public name: string = "";
    public description: string = "";
    public proteins: string = "";
    public allergens: string = "";
    public price: number = 0;
    public image!: File | string | null;
    public active!: boolean;
}