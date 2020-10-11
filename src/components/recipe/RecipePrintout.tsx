import React from 'react';
import Recipe from "../../models/RecipeModel";
import './recipe.scss';
import RecipeIngredient from "../../models/RecipeIngredientModel";
import Ingredient from "../../models/IngredientModel";
import recipeHelper from '../../helpers/RecipeHelper';
import Allergen from "../../models/AllergenModel";

interface Props {
    recipe: Recipe,
    count: number
}

export const RecipePrintout = (props: Props): React.ReactElement => {
    return (
        <div className='recipe_printout'>
            <div className='recipe_printout__name'>
                <h1>{props.recipe.name}</h1>
                <h3>{props.count} servings</h3>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <td>ingredient</td>
                        <td>quantity</td>
                        <td>allergens</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.recipe.ingredients.map((recipeIngredient: RecipeIngredient) => {
                            const ingredient: Ingredient = recipeIngredient.ingredient as Ingredient
                            return (
                                <tr className='recipe_printout__ingredient'>
                                    <td>{ingredient.name}</td>
                                    <td>{recipeHelper.scaleRecipeIngredient(recipeIngredient, props.recipe.servings, props.count)}</td>
                                    <td>
                                        {
                                            ingredient.allergens.length === 0 ?
                                                <span>no allergens</span>
                                                :
                                                recipeHelper.createStringListOfAllergensFromIngredient(ingredient)
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {props.recipe.instructions !== '' &&
                <div className='mt-2'>
                    <h3>instructions:</h3>
                    <p>{props.recipe.instructions}</p>
                </div>
            }
        </div>
    )
}