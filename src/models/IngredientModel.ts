import ModelBase from "./ModelBase";
import Allergen from "./AllergenModel";

export default class Ingredient extends ModelBase {
    public name!: string;
    public description!: string;
    public allergens!: Allergen[];
    public allergens_ids!: number[];

    constructor(
        name: string = '',
        description: string = '',
        allergens: Allergen[] = [],
        allergens_ids: number[] = []
    ) {
        super();
        this.name = name;
        this.description = description;
        this.allergens = allergens;
        this.allergens_ids = allergens_ids;
    }
}
