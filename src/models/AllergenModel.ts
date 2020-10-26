import ModelBase from "./ModelBase";

export default class Allergen extends ModelBase {
    public name!: string;

    constructor(
        id: number = -1,
        name: string = ''
    ) {
        super();
        this.id = id;
        this.name = name;
    }
}