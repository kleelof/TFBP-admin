import ModelBase from "./ModelBase";
import RecipeIngredient from "./RecipeIngredientModel";
import RecipeNote from "./RecipeNoteModel";

export default class Recipe extends ModelBase {
    public name!: string;
    public description!: string;
    public instructions!: string;
    public is_vegan!: boolean;
    public ingredients!: RecipeIngredient[];
    public servings!: number;
    public notes!: RecipeNote[];
    public yld!: number;

    constructor(
        name: string = '',
        description: string = '',
        instructions: string = '',
        is_vegan: boolean = false,
        ingredients: RecipeIngredient[] = [],
        servings: number = 1
    ) {
        super();
        this.name = name;
        this.description = description;
        this.instructions = instructions;
        this.is_vegan = is_vegan;
        this.ingredients = ingredients;
        this.servings = servings;
    }
}