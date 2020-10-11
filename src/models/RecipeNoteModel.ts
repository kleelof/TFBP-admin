import ModelBase from "./ModelBase";
import Recipe from "./RecipeModel";

export default class RecipeNote extends ModelBase {
    public text!: string;
    public recipe!: Recipe | number;

    constructor(
        id: number = -1,
        text: string = '',
        recipe: Recipe | number = -1
    ) {
        super();

        this.id = id;
        this.text = text;
        this.recipe = recipe;
    }
}